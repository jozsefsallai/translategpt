"use client";

import { translateAction } from "@/app/actions";
import { ApiKeyDialog } from "@/components/dialogs/api-key-dialog";
import { LanguageList } from "@/components/language-list/language-list";
import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_LANGS,
  LANGUAGES,
  LANG_AUTO,
  Language,
} from "@/constants/languages";
import { useApiKey } from "@/hooks/use-api-key";
import {
  LatestLanguagesKind,
  getLatestLanguages,
  saveLatestLanguages,
} from "@/lib/latest-languages";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Check, Copy, Lightbulb } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useEffect, useState } from "react";

export default function TranslationArea() {
  const [loading, setLoading] = useState(true);

  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [text, setText] = useState("");
  const [latestSrcLanguages, setLatestSrcLanguages] =
    useState<Language[]>(DEFAULT_LANGS);
  const [latestDestLanguages, setLatestDestLanguages] =
    useState<Language[]>(DEFAULT_LANGS);

  const [srcLang, setSrcLang] = useState<Language>(latestSrcLanguages[0]);
  const [destLang, setDestLang] = useState<Language>(
    latestDestLanguages.find((lang) => lang.code !== srcLang.code)!
  );

  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [copying, setCopying] = useState(false);

  useEffect(() => {
    setDialogOpen(!apiKey);
  }, [apiKey]);

  useEffect(() => {
    const savedLatestSrc = getLatestLanguages(LatestLanguagesKind.Src);
    if (savedLatestSrc) {
      setLatestSrcLanguages(savedLatestSrc);
      setSrcLang(savedLatestSrc[0]);
    }

    const savedLatestDest = getLatestLanguages(LatestLanguagesKind.Dest);
    if (savedLatestDest) {
      setLatestDestLanguages(savedLatestDest);
      setDestLang(savedLatestDest.find((lang) => lang.code !== srcLang.code)!);
    }

    setLoading(false);
  }, []);

  function onApiKeyChange(newApiKey: string) {
    setApiKey(newApiKey);
    setDialogOpen(false);
  }

  function onClearApiKey() {
    clearApiKey();
  }

  function onOpenStateChange(open: boolean) {
    if (!apiKey) {
      return;
    }

    setDialogOpen(open);
  }

  const onTranslate = useCallback(async () => {
    setError(null);
    setTranslation(null);
    setIsTranslating(true);

    try {
      const response = await translateAction({
        apiKey,
        src: srcLang.code,
        dest: destLang.code,
        text,
      });

      setTranslation(response.translation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  }, [apiKey, srcLang, destLang, text]);

  function swapLanguages() {
    const newSrcLatest = latestDestLanguages.slice(0);
    const newDestLatest = latestSrcLanguages.slice(0);

    const newSrcLang = destLang;
    const newDestLang = srcLang;

    setLatestSrcLanguages(newSrcLatest);
    setLatestDestLanguages(newDestLatest);

    setSrcLang(newSrcLang);
    setDestLang(newDestLang);
  }

  function onSrcLangChange(lang: Language) {
    if (lang.code === srcLang.code) {
      return;
    }

    if (lang.code === destLang.code) {
      if (srcLang.code !== LANG_AUTO.code) {
        swapLanguages();
        return;
      } else {
        onDestLangChange(
          latestDestLanguages.find((l) => l.code !== lang.code)!
        );
      }
    }

    if (!latestSrcLanguages.includes(lang) && lang.code !== LANG_AUTO.code) {
      const newLatest = [lang, ...latestSrcLanguages].slice(0, 3);
      setLatestSrcLanguages(newLatest);
      saveLatestLanguages(LatestLanguagesKind.Src, newLatest);
    }

    setSrcLang(lang);
  }

  function onDestLangChange(lang: Language) {
    if (lang.code === destLang.code) {
      return;
    }

    if (lang.code === srcLang.code) {
      swapLanguages();
      return;
    }

    if (!latestDestLanguages.includes(lang)) {
      const newLatest = [lang, ...latestDestLanguages].slice(0, 3);
      setLatestDestLanguages(newLatest);
      saveLatestLanguages(LatestLanguagesKind.Dest, newLatest);
    }

    setDestLang(lang);
  }

  async function copyToClipboard() {
    if (copying || !translation) {
      return;
    }

    setCopying(true);
    await navigator.clipboard.writeText(translation);

    setTimeout(() => {
      setCopying(false);
    }, 1000);
  }

  useHotkeys(
    "ctrl+return",
    () => {
      if (!apiKey || dialogOpen) {
        return;
      }

      onTranslate();
    },
    { enableOnFormTags: true }
  );

  return (
    <>
      {loading && (
        <div className="px-5 py-8 text-center text-2xl animate-pulse">
          Loading...
        </div>
      )}

      {!loading && (
        <>
          <div className="flex md:gap-4">
            <div className="flex-1">
              <LanguageList
                languages={LANGUAGES.filter((lang) => lang !== LANG_AUTO)}
                latestLanguages={latestSrcLanguages}
                displayAuto={true}
                onLanguageSelect={onSrcLangChange}
                selectedLanguage={srcLang}
              />
            </div>

            <div>
              <Button variant="ghost" onClick={swapLanguages}>
                <ArrowLeftRight className="h-4 w-4 shrink-0" />
              </Button>
            </div>

            <div className="flex-1">
              <LanguageList
                languages={LANGUAGES.filter((lang) => lang !== LANG_AUTO)}
                latestLanguages={latestDestLanguages}
                displayAuto={false}
                onLanguageSelect={onDestLangChange}
                selectedLanguage={destLang}
              />
            </div>
          </div>

          <div className="mt-2 md:flex gap-5">
            <div className="flex-1 relative mb-4 md:mb-0">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate..."
                className="text-lg h-48 md:h-64 resize-none"
                maxLength={4000}
              />

              <div className="absolute bottom-2 right-2 text-xs text-secondary-foreground select-none">
                {text.length}/4000
              </div>
            </div>

            <div
              className={cn(
                "relative flex-1 text-lg h-48 md:h-64 rounded-md border border-input bg-muted px-3 py-2",
                {
                  "border-destructive": !!error,
                  "bg-destructive/20": !!error,
                  "text-destructive": !!error,
                  "text-muted-foreground": isTranslating,
                }
              )}
            >
              {isTranslating
                ? "Translating..."
                : error || translation || "Translation will appear here."}

              {!!translation && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2 opacity-75 hover:opacity-100 hover:bg-background"
                  onClick={copyToClipboard}
                >
                  {!copying && <Copy className="h-4 w-4 shrink-0" />}
                  {copying && <Check className="h-4 w-4 shrink-0" />}
                </Button>
              )}
            </div>
          </div>

          <div className="hidden md:flex gap-2 text-xs justify-center items-center mt-4 text-secondary-foreground">
            <Lightbulb className="h-4 w-4 shrink-0" />
            Pro tip: You can press Ctrl+Enter to translate.
          </div>

          <div className="flex flex-col items-center mt-4 gap-5">
            <Button
              className="text-lg px-12 py-6 font-extrabold"
              onClick={onTranslate}
            >
              Translate
            </Button>

            <div className="flex gap-2">
              <ThemeSwitcher />

              <Button variant="outline" asChild>
                <a
                  href="https://github.com/jozsefsallai/translategpt"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Source code
                </a>
              </Button>

              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Set API key
              </Button>
            </div>
          </div>
        </>
      )}

      <ApiKeyDialog
        open={dialogOpen}
        onOpenStateChange={onOpenStateChange}
        currentApiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
        onClearApiKey={onClearApiKey}
      />
    </>
  );
}
