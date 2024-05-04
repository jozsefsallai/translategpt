import { z } from "zod";

import { Language } from "@/constants/languages";
import { generateObject } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";

export const translationResultSchema = z.object({
  translation: z.string(),
});

export type TranslationResult = z.infer<typeof translationResultSchema>;

export async function translate(
  apiKey: string,
  src: Language,
  dest: Language,
  text: string
): Promise<TranslationResult> {
  const model = createOpenAI({
    apiKey,
  })("gpt-3.5-turbo");

  const prompt =
    src.code === "auto"
      ? `Translate the following text to ${dest.name}:\n\n${text}`
      : `Translate the following text from ${src.name} to ${dest.name}:\n\n${text}`;

  const { object } = await generateObject({
    model,
    schema: translationResultSchema,
    prompt,
  });

  return object;
}
