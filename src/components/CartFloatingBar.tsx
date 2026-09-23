"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/utils/formatters";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const CartFloatingBar: React.FC = () => {
  const { totalItems, subtotal, setIsCartOpen, isCartOpen, isCheckoutOpen, lastOrder } = useCart();

  // Hide when cart is empty or when drawer/checkout/confirmation is open
  if (totalItems === 0 || isCartOpen || isCheckoutOpen || lastOrder !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 inset-x-4 z-30 md:hidden animate-slide-up">
      <div className="max-w-md mx-auto bg-[#352519] text-[#EEEBE7] rounded-2xl p-3 sm:p-3.5 shadow-warm-lg flex items-center justify-between border border-[#352519]/40">
        <div
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EEEBE7] text-[#352519] flex items-center justify-center font-black text-sm relative shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#352519] text-[#EEEBE7] border-2 border-[#EEEBE7] rounded-full text-[10px] font-black flex items-center justify-center">
              {totalItems}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-[#EEEBE7]/70 font-medium leading-none">
              {totalItems} Menu Dipilih
            </span>
            <span className="text-base font-black text-[#EEEBE7] leading-tight mt-0.5">
              {formatRupiah(subtotal)}
            </span>
          </div>
        </div>

        <button
          id="mobile-bottom-checkout-btn"
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#EEEBE7] text-[#352519] font-bold text-xs flex items-center gap-1.5 hover:bg-white active:scale-95 transition-all shadow-sm"
        >
          <span>Keranjang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
