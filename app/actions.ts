"use server";

import {
  HandleTranslateArgs,
  TranslationError,
  handleTranslate,
} from "@/core/handle-translate";
import { TranslationResult } from "@/lib/translate";

export interface TranslateActionResult {
  ok: boolean;
  data?: TranslationResult;
  error?: string;
}

export async function translateAction(
  args: HandleTranslateArgs
): Promise<TranslateActionResult> {
  try {
    const data = await handleTranslate(args);
    return { ok: true, data };
  } catch (err: any) {
    if (err.name === "TranslationError") {
      return { ok: false, error: (err as TranslationError).message };
    } else {
      console.error(err);
      return { ok: false, error: "Internal server error." };
    }
  }
}
