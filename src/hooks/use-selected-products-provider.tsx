"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Product, SelectedProduct } from "@/types";
import { useToast } from "@/components/ui/toast";

const STORAGE_KEY = "lanem-glow:selected-products";

type SelectedProductsContextValue = {
  items: SelectedProduct[];
  count: number;
  addProduct: (product: Product | SelectedProduct) => void;
  removeProduct: (productId: string) => void;
  toggleProduct: (product: Product | SelectedProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearProducts: () => void;
  isSelected: (productId: string) => boolean;
};

const SelectedProductsContext = createContext<SelectedProductsContextValue | null>(null);

export function toSelectedProduct(product: Product | SelectedProduct): SelectedProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    stockStatus: product.stockStatus,
    orderQuantity: ("orderQuantity" in product ? product.orderQuantity : 1) ?? 1,
  };
}

export function addSelectedProduct(
  items: SelectedProduct[],
  product: Product | SelectedProduct
): SelectedProduct[] {
  const nextProduct = toSelectedProduct(product);

  if (items.some((item) => item.id === nextProduct.id)) {
    return items;
  }

  return [...items, nextProduct];
}

export function removeSelectedProduct(items: SelectedProduct[], productId: string): SelectedProduct[] {
  return items.filter((item) => item.id !== productId);
}

export function toggleSelectedProduct(
  items: SelectedProduct[],
  product: Product | SelectedProduct
): SelectedProduct[] {
  const nextProduct = toSelectedProduct(product);

  if (items.some((item) => item.id === nextProduct.id)) {
    return removeSelectedProduct(items, nextProduct.id);
  }

  return addSelectedProduct(items, nextProduct);
}

function readPersistedProducts(): SelectedProduct[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SelectedProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function SelectedProductsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SelectedProduct[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readPersistedProducts());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const { toast } = useToast();

  const addProduct = useCallback((product: Product | SelectedProduct) => {
    if (product.stockStatus === "out_of_stock") {
      return;
    }

    setItems((current) => {
      const isAlreadyInCart = current.some(item => item.id === product.id);
      
      if (!isAlreadyInCart) {
        toast(`Đã thêm ${product.name} vào giỏ hàng`, "success");
      }
      
      return addSelectedProduct(current, product);
    });
  }, [toast]);

  const removeProduct = useCallback((productId: string) => {
    setItems((current) => removeSelectedProduct(current, productId));
  }, []);

  const toggleProduct = useCallback((product: Product | SelectedProduct) => {
    if (product.stockStatus === "out_of_stock") {
      return;
    }

    setItems((current) => {
      const isAlreadyInCart = current.some(item => item.id === product.id);
      
      if (!isAlreadyInCart) {
        toast(`Đã thêm ${product.name} vào giỏ hàng`, "success");
      }
      
      return toggleSelectedProduct(current, product);
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, orderQuantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const clearProducts = useCallback(() => {
    setItems([]);
  }, []);

  const isSelected = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addProduct,
      removeProduct,
      toggleProduct,
      updateQuantity,
      clearProducts,
      isSelected,
    }),
    [addProduct, clearProducts, isSelected, items, removeProduct, toggleProduct, updateQuantity]
  );

  return (
    <SelectedProductsContext.Provider value={value}>
      {children}
    </SelectedProductsContext.Provider>
  );
}

export function useSelectedProducts() {
  const context = useContext(SelectedProductsContext);

  if (!context) {
    throw new Error("useSelectedProducts must be used within SelectedProductsProvider");
  }

  return context;
}
