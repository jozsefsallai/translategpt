import { clear, retrieve, store } from "@/lib/storage";
import { createContext, useContext, useEffect, useState } from "react";

const LOCALSTORAGE_KEY = "__translategpt__openai-api-key__";

export interface IApiKeyHookData {
  apiKey: string | null;
  setApiKey: (apiKey: string | null) => void;
  clearApiKey: () => void;
}

export const ApiKeyContext = createContext<IApiKeyHookData>({
  apiKey: null,
  setApiKey: (_) => void 0,
  clearApiKey: () => void 0,
});

export const __useApiKey = (): IApiKeyHookData => {
  const [apiKey, _setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const key = retrieve(LOCALSTORAGE_KEY);
    _setApiKey(key);
  }, []);

  const setApiKey = (apiKey: string | null) => {
    _setApiKey(apiKey);

    if (apiKey) {
      store(LOCALSTORAGE_KEY, apiKey);
    } else {
      clear(LOCALSTORAGE_KEY);
    }
  };

  const clearApiKey = () => {
    setApiKey(null);
  };

  return {
    apiKey,
    setApiKey,
    clearApiKey,
  };
};

export const useApiKey = () => {
  return useContext(ApiKeyContext);
};
