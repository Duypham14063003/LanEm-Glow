"use client";

import type { ReactNode } from "react";

import { QuickOrderProvider } from "@/hooks/use-quick-order";
import { SelectedProductsProvider } from "@/hooks/use-selected-products";

import { QuickOrderBar } from "@/components/site/quick-order-bar";
import { QuickOrderSheet } from "@/components/site/quick-order-sheet";

export function QuickOrderShell({ children }: { children: ReactNode }) {
  return (
    <SelectedProductsProvider>
      <QuickOrderProvider>
        {children}
        <QuickOrderBar />
        <QuickOrderSheet />
      </QuickOrderProvider>
    </SelectedProductsProvider>
  );
}
