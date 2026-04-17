"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type { QuickOrderFormValues, SelectedProduct } from "@/types";

type QuickOrderSource = "bar" | "detail" | "card" | "cta";

type QuickOrderContextValue = {
  isOpen: boolean;
  source: QuickOrderSource | null;
  openQuickOrder: (source?: QuickOrderSource) => void;
  closeQuickOrder: () => void;
};

type QuickOrderValidationResult = {
  isValid: boolean;
  errors: Partial<Record<keyof QuickOrderFormValues | "selectedProducts", string>>;
};

const PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;
const QuickOrderContext = createContext<QuickOrderContextValue | null>(null);

export function validateQuickOrderForm(
  values: QuickOrderFormValues,
  selectedProducts: SelectedProduct[]
): QuickOrderValidationResult {
  const errors: QuickOrderValidationResult["errors"] = {};

  if (selectedProducts.length === 0) {
    errors.selectedProducts = "Vui lòng chọn ít nhất 1 sản phẩm trước khi gửi.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Số điện thoại là bắt buộc.";
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = "Số điện thoại chưa đúng định dạng di động Việt Nam.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function QuickOrderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<QuickOrderSource | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      source,
      openQuickOrder: (nextSource: QuickOrderSource = "cta") => {
        setSource(nextSource);
        setIsOpen(true);
      },
      closeQuickOrder: () => {
        setIsOpen(false);
      },
    }),
    [isOpen, source]
  );

  return <QuickOrderContext.Provider value={value}>{children}</QuickOrderContext.Provider>;
}

export function useQuickOrder() {
  const context = useContext(QuickOrderContext);

  if (!context) {
    throw new Error("useQuickOrder must be used within QuickOrderProvider");
  }

  return context;
}
