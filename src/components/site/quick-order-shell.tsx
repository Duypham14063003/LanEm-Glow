"use client";

import type { ReactNode } from "react";

import { QuickOrderProvider } from "@/hooks/use-quick-order";
import { SelectedProductsProvider } from "@/hooks/use-selected-products";

import { QuickOrderBar } from "@/components/site/quick-order-bar";
import { QuickOrderSheet } from "@/components/site/quick-order-sheet";
import { ToastProvider } from "@/components/ui/toast";

export function QuickOrderShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SelectedProductsProvider>
        <QuickOrderProvider>
          {children}
          <QuickOrderBar />
          <QuickOrderSheet />
        </QuickOrderProvider>
      </SelectedProductsProvider>
    </ToastProvider>
  );
}
