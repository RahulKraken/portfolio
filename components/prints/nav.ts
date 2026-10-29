"use client";

import { createContext, useContext } from "react";
import type { PrintId } from "@/lib/prints";

export type PrintsNav = {
  open: (id: PrintId) => void;
  close: () => void;
  go: (id: PrintId) => void;
};

export const PrintsNavContext = createContext<PrintsNav | null>(null);

export function usePrintsNav() {
  const nav = useContext(PrintsNavContext);
  if (!nav) {
    throw new Error("usePrintsNav must be used within FivePrints");
  }
  return nav;
}
