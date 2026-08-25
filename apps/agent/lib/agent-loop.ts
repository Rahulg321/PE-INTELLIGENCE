import {
    generateText,
    isStepCount,
    type JSONValue,
    type LanguageModel,
    type ModelMessage,
    type ToolSet,
} from "ai";
import type { ModelTier } from "@repo/ai";
import { logger } from "./logger";

export type StepConfig = {
    retries?: { limit: number; delay: string | number };
    timeout?: string | number;
};

/**
 * The subset of a Cloudflare Workflow `step` that the agent loop needs. Kept
 * structural so the loop is testable outside a Workflow (local Bun path).
 */
export type DurableStep = {
    do(name: string, callback: () => Promise<unknown>, config?: StepConfig): Promise<unknown>;
};

/**
 * Optional dependencies a lane receives from its caller.
 * - `step`: a durable workflow step — when present, every LLM turn, every
 *   side-effecting tool execution, and every audit write is checkpointed as its
 *   own `step.do`, so the run survives isolate eviction and retries at the
 *   individual-call level.
 * - `modelTier`: overrides the lane's default tier ("fast" / "research").
 */
export type LaneDeps = {
    step?: DurableStep;
    modelTier?: ModelTier;
};

export type LoopTurn = {
    stepNumber: number;
    text: string;
    toolCalls: { toolName: string; args: unknown }[];
    toolResults: unknown[];
    finishReason: unknown;
    usage: unknown;
};

export type AgentLoopOptions = {
    step?: DurableStep;
    model: LanguageModel;
    instructions: string;
    tools: ToolSet;
    toolsContext: Record<string, unknown>;
    prompt: string;
    maxTurns?: number;
    onStepEnd?: (turn: LoopTurn) => void | Promise<void>;
};

export type AgentLoopResult = {
    turns: number;
    text: string;
};

type ToolCallLike = { toolName: string; args: unknown; toolCallId: string };

type TurnOutput = {
    messages: ModelMessage[];
    toolCalls: ToolCallLike[];
    text: string;
    finishReason: unknown;
    usage: unknown;
};

async function durable<T>(
    step: DurableStep | undefined,
    name: string,
    config: StepConfig | undefined,
    callback: () => Promise<T>,
): Promise<T> {
    if (step) return step.do(name, callback, config) as Promise<T>;
    return callback();
}

/**
 * generateText auto-executes tools inside its own loop. We drive the loop
 * ourselves (one durable step per turn + per tool), so strip `execute` from the
 * tools we hand to the model: it still sees the tool definitions and emits tool
 * calls, but nothing is executed until our own `step.do` runs it.
 */
function stripExecutes(tools: ToolSet): ToolSet {
    const stripped: Record<string, unknown> = {};
    for (const [name, tool] of Object.entries(tools)) {
        stripped[name] = { ...(tool as object), execute: undefined };
    }
    return stripped as unknown as ToolSet;
}

/**
 * Runs the agent loop one model turn at a time. With a `step` present, each
 * turn, each tool execution, and each audit write is a durable checkpoint whose
 * output is replayed (never re-executed) if the workflow resumes after eviction.
 *
 * The write-tools this loop calls (recordFact/recordBrand/writeBrief) are
 * idempotent DB updates, which is what makes per-step retries safe.
 */
export async function runAgentLoop(options: AgentLoopOptions): Promise<AgentLoopResult> {
    const maxTurns = options.maxTurns ?? 12;
    let messages: ModelMessage[] = [
        { role: "user", content: options.prompt },
    ];
    let turns = 0;
    let text = "";

    for (let turn = 1; turn <= maxTurns; turn++) {
        const result = await durable(
            options.step,
            `llm turn ${turn}`,
            { retries: { limit: 2, delay: "2 seconds" }, timeout: "10 minutes" },
            async (): Promise<TurnOutput> => {
                const response = await generateText({
                    model: options.model,
                    tools: stripExecutes(options.tools),
                    messages,
                    instructions: options.instructions,
                    stopWhen: isStepCount(1),
                });
                const toolCalls = (response.steps[0]?.toolCalls ?? []).map((call) => ({
                    toolName: call.toolName,
                    args: call.input,
                    toolCallId: call.toolCallId,
                }));
                return {
                    messages: response.responseMessages as ModelMessage[],
                    toolCalls,
                    text: response.text,
                    finishReason: response.finishReason,
                    usage: response.usage,
                };
            },
        );

        turns++;
        text = result.text;

        const lastMessage = result.messages[result.messages.length - 1];
        if (lastMessage) {
            messages = [...messages, lastMessage];
        }

        if (options.onStepEnd) {
            const turnInfo: LoopTurn = {
                stepNumber: turn,
                text,
                toolCalls: result.toolCalls.map((call) => ({
                    toolName: call.toolName,
                    args: call.args,
                })),
                toolResults: [],
                finishReason: result.finishReason,
                usage: result.usage,
            };
            // Durable audit: on workflow replay the step returns its cached output,
            // so audit rows are not duplicated.
            await durable(options.step, `audit turn ${turn}`, undefined, async () =>
                options.onStepEnd!(turnInfo),
            );
        }

        if (result.toolCalls.length === 0) {
            break;
        }

        const toolMessages: ModelMessage[] = [];
        for (const [index, call] of result.toolCalls.entries()) {
            const output = await durable(
                options.step,
                `execute ${call.toolName} ${turn}.${index + 1}`,
                { retries: { limit: 1, delay: "5 seconds" }, timeout: "5 minutes" },
                async () => {
                    const tool = (options.tools as Record<string, unknown>)[call.toolName];
                    if (!tool) {
                        return { status: "error", error: `unknown tool: ${call.toolName}` };
                    }
                    const execute = (
                        tool as { execute?: (input: unknown, options?: { context?: unknown }) => unknown }
                    ).execute;
                    if (typeof execute !== "function") {
                        return { status: "error", error: `tool ${call.toolName} has no execute` };
                    }
                    const inputSchema = (
                        tool as { inputSchema?: { parse?: (value: unknown) => unknown } }
                    ).inputSchema;
                    const input = inputSchema?.parse ? inputSchema.parse(call.args) : call.args;
                    const context = options.toolsContext[call.toolName];
                    return context === undefined
                        ? execute(input)
                        : execute(input, { context });
                },
            );
            toolMessages.push({
                role: "tool",
                content: [
                    {
                        type: "tool-result",
                        toolCallId: call.toolCallId,
                        toolName: call.toolName,
                        output: { type: "json", value: (output ?? null) as JSONValue },
                    },
                ],
            } as ModelMessage);
        }
        messages = [...messages, ...toolMessages];
    }

    logger.debug(`agent loop finished turns=${turns} text="${text.slice(0, 80)}"`);
    return { turns, text };
}
