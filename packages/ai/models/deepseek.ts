import "@repo/env/load";
import { createDeepSeek } from "@ai-sdk/deepseek";

export const deepSeek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export const deepSeekChat = deepSeek(process.env.DEEPSEEK_MODEL ?? "deepseek-chat");
