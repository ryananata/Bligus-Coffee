"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Product, CartItem, Order, AddOn } from "@/types";
import { generateOrderId } from "@/utils/orderId";
import { PRODUCTS } from "@/data/products";
import { supabase } from "@/utils/supabase";

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedAddOns?: AddOn[]
  ) => { success: boolean; message?: string };
  increaseQuantity: (cartItemId: string) => { success: boolean; message?: string };
  decreaseQuantity: (cartItemId: string) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getProductTotalQuantity: (productId: number) => number;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  customizingProduct: Product | null;
  setCustomizingProduct: (product: Product | null) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  createOrder: (
    customerName: string,
    whatsapp: string,
    notes?: string,
    proofImage?: string
  ) => Promise<Order>;
  activeToast: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bligus_coffee_cart_v2";

export function generateCartItemId(productId: number, selectedAddOns: AddOn[] = []): string {
  const sortedAddonIds = [...selectedAddOns].map((a) => a.id).sort().join("_");
  return `${productId}${sortedAddonIds ? `_${sortedAddonIds}` : ""}`;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast((current) => (current === msg ? null : current));
    }, 2800);
  };

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        const validated = parsed
          .map((item) => {
            const product = PRODUCTS.find((p) => p.id === item.product.id) || item.product;
            const validAddOns = item.selectedAddOns || [];
            const addOnsSum = validAddOns.reduce((sum, a) => sum + a.price, 0);
            const unitTotalPrice = product.price + addOnsSum;
            return {
              ...item,
              product,
              selectedAddOns: validAddOns,
              unitTotalPrice,
            };
          })
          .filter((item) => item.quantity > 0);
        setItems(validated);
      }
    } catch (e) {
      console.error("Error loading cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Error saving cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const getProductTotalQuantity = (productId: number): number => {
    return items
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const addToCart = (
    product: Product,
    quantityToAdd: number = 1,
    selectedAddOns: AddOn[] = []
  ): { success: boolean; message?: string } => {
    if (!product.isAvailable) {
      showToast(`${product.name} sedang tidak tersedia.`);
      return { success: false, message: "Tidak tersedia" };
    }

    const cartItemId = generateCartItemId(product.id, selectedAddOns);
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitTotalPrice = product.price + addOnsTotal;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            quantity: quantityToAdd,
            selectedAddOns,
            unitTotalPrice,
          },
        ];
      }
    });

    const addOnNames = selectedAddOns.map((a) => a.name).join(", ");
    showToast(
      `${product.name}${addOnNames ? ` (${addOnNames})` : ""} ditambahkan ke keranjang`
    );
    return { success: true };
  };

  const increaseQuantity = (cartItemId: string): { success: boolean; message?: string } => {
    let success = true;
    let message = "";

    setItems((prevItems) => {
      const item = prevItems.find((i) => i.cartItemId === cartItemId);
      if (!item) return prevItems;

      if (!item.product.isAvailable) {
        success = false;
        message = "Menu tidak tersedia";
        showToast(`${item.product.name} sedang tidak tersedia`);
        return prevItems;
      }

      return prevItems.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    });

    return { success, message };
  };

  const decreaseQuantity = (cartItemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.cartItemId === cartItemId);
      if (!item) return prevItems;

      if (item.quantity <= 1) {
        showToast(`${item.product.name} dihapus dari keranjang`);
        return prevItems.filter((i) => i.cartItemId !== cartItemId);
      }

      return prevItems.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.cartItemId === cartItemId);
      if (item) {
        showToast(`${item.product.name} dihapus dari keranjang`);
      }
      return prevItems.filter((i) => i.cartItemId !== cartItemId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.unitTotalPrice * item.quantity, 0);
  }, [items]);

  const createOrder = async (
    customerName: string,
    whatsapp: string,
    notes?: string,
    proofImage?: string
  ): Promise<Order> => {
    const orderItems = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      unitTotalPrice: item.unitTotalPrice,
      quantity: item.quantity,
      subtotal: item.unitTotalPrice * item.quantity,
      addOns: item.selectedAddOns.map((a) => `${a.name} (+Rp${a.price.toLocaleString("id-ID")})`),
    }));

    const newOrder: Order = {
      id: generateOrderId(),
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      notes: notes?.trim() || undefined,
      items: orderItems,
      total: subtotal,
      proofImage,
      status: "Menunggu Diproses",
      createdAt: new Date().toISOString(),
    };

    setLastOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setIsCheckoutOpen(false);

    try {
      // 1. Simpan ke tabel orders
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: newOrder.id,
          customer_name: newOrder.customerName,
          whatsapp: newOrder.whatsapp,
          notes: newOrder.notes,
          total_amount: newOrder.total,
          proof_image: newOrder.proofImage, 
          status: newOrder.status
        });

      if (orderError) {
        console.error("Supabase Order Error:", orderError);
        throw orderError;
      }

      // 2. Simpan ke tabel order_items
      const orderItemsToInsert = items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price: item.unitTotalPrice,
        quantity: item.quantity,
        subtotal: item.unitTotalPrice * item.quantity,
        add_ons: item.selectedAddOns.map((a) => `${a.name} (+Rp${a.price.toLocaleString("id-ID")})`)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
         console.error("Supabase Order Items Error:", itemsError);
         throw itemsError;
      }
      
    } catch (e) {
      console.error("Error saving order to Supabase", e);
      alert("Terjadi kesalahan jaringan saat menyimpan pesanan. Tim kami akan segera memeriksanya.");
    }

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getProductTotalQuantity,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        customizingProduct,
        setCustomizingProduct,
        lastOrder,
        setLastOrder,
        createOrder,
        activeToast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
