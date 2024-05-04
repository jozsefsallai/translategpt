import { LANGUAGES } from "@/constants/languages";
import { TranslationResult, translate } from "@/lib/translate";

export class TranslationError extends Error {
  name = "TranslationError";
  code: number;

  constructor(message: string, code: number = 500) {
    super(message);
    this.code = code;
  }
}

export interface HandleTranslateArgs {
  apiKey?: string | null;
  src?: string | null;
  dest?: string | null;
  text?: string | null;
}

export async function handleTranslate({
  apiKey,
  src,
  dest,
  text,
}: HandleTranslateArgs): Promise<TranslationResult> {
  const srcLang = LANGUAGES.find((lang) => lang.code === src);
  const destLang = LANGUAGES.find((lang) => lang.code === dest);

  if (!apiKey) {
    throw new TranslationError("OpenAI API key not provided.", 403);
  }

  if (!srcLang) {
    throw new TranslationError(`Invalid source language: ${src}.`, 400);
  }

  if (!destLang) {
    throw new TranslationError(`Invalid destination language: ${dest}.`, 400);
  }

  if (destLang.code === "auto") {
    throw new TranslationError("Destination language cannot be 'auto'.", 400);
  }

  if (!text || text.length < 1 || text.length > 4000) {
    throw new TranslationError(
      "Text must be between 1 and 4000 characters.",
      400
    );
  }

  try {
    const response = await translate(apiKey, srcLang, destLang, text);
    return response;
  } catch (err) {
    throw new TranslationError(
      "An error occurred while translating the text.",
      500
    );
  }
}
