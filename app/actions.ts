"use server";

import { HandleTranslateArgs, handleTranslate } from "@/core/handle-translate";
import { TranslationResult } from "@/lib/translate";

export async function translateAction(
  args: HandleTranslateArgs
): Promise<TranslationResult> {
  return handleTranslate(args);
}
