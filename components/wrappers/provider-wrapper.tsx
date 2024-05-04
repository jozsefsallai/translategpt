"use client";

import { ApiKeyProvider } from "@/components/providers/api-key-provider";
import { ReactNode } from "react";

export function ProviderWrapper({ children }: { children: ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>;
}
