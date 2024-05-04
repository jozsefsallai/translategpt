import { __useApiKey, ApiKeyContext } from "@/hooks/use-api-key";
import React from "react";

export const ApiKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiKey, setApiKey, clearApiKey } = __useApiKey();

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        clearApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};
