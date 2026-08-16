import { generateText, stepCountIs, type LanguageModel, type ToolSet } from "ai";

export type ResearchStep = {
    text: string;
    toolCalls: unknown[];
    toolResults: unknown[];
    finishReason: unknown;
    usage: unknown;
};

export async function runResearchTask(options: {
    model: LanguageModel;
    system: string;
    prompt?: string;
    tools: ToolSet;
    budget: number;
    onStepFinish?: (step: ResearchStep) => void | Promise<void>;
}) {
    const { model, system, prompt, tools, budget, onStepFinish } = options;
    return generateText({
        model,
        system,
        prompt: prompt ?? "Begin the research task now.",
        tools,
        stopWhen: stepCountIs(Math.max(1, budget + 4)),
        onStepFinish: onStepFinish
            ? (step) =>
                onStepFinish({
                    text: step.text,
                    toolCalls: step.toolCalls,
                    toolResults: step.toolResults,
                    finishReason: step.finishReason,
                    usage: step.usage,
                })
            : undefined,
    });
}
