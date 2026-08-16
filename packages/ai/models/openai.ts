import "@repo/env/load";
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const openaiChat = openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
