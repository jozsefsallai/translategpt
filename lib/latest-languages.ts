import { LANGUAGES, Language } from "@/constants/languages";
import { retrieve, store } from "@/lib/storage";

export enum LatestLanguagesKind {
  Src = "__translategpt__latest-src-languages__",
  Dest = "__translategpt__latest-dest-languages__",
}

export function getLatestLanguages(
  kind: LatestLanguagesKind
): Language[] | null {
  const latestLanguages = retrieve(kind);
  if (!latestLanguages) {
    return null;
  }

  return latestLanguages
    .split(",")
    .map((code) => LANGUAGES.find((lang) => lang.code === code))
    .filter(Boolean) as Language[];
}

export function saveLatestLanguages(
  kind: LatestLanguagesKind,
  languages: Language[]
) {
  const codes = languages.map((lang) => lang.code).join(",");
  store(kind, codes);
}
