import "@repo/env/load";
import type { LanguageModel } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createOpenAI } from "@ai-sdk/openai";

export type ModelTier = "fast" | "research";

const deepSeek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY ?? "" });
const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TIER_DEFAULT_MODEL: Record<ModelTier, string> = {
    fast: "deepseek-chat",
    research: "deepseek-chat",
};

export function getModel(tier: ModelTier): LanguageModel {
    const raw = process.env[`MODEL_${tier.toUpperCase()}`];
    if (raw && raw.includes(":")) {
        const [provider, modelId] = raw.split(":");
        if (provider === "deepseek") {
            return deepSeek(modelId as Parameters<typeof deepSeek>[0]);
        }
        if (provider === "openai" && process.env.OPENAI_API_KEY) {
            return openai(modelId as Parameters<typeof openai>[0]);
        }
    }
    return deepSeek(TIER_DEFAULT_MODEL[tier]);
}

export function isModelAvailable(tier: ModelTier): boolean {
    const raw = process.env[`MODEL_${tier.toUpperCase()}`];
    if (raw && raw.includes(":")) {
        const [provider] = raw.split(":");
        if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
        if (provider === "deepseek") return Boolean(process.env.DEEPSEEK_API_KEY);
    }
    return Boolean(process.env.DEEPSEEK_API_KEY);
}
