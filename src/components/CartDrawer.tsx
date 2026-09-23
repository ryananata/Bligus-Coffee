"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "./CartItem";
import { formatRupiah } from "@/utils/formatters";
import { X, ShoppingBag, ArrowRight, Coffee } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    totalItems,
    subtotal,
    clearCart,
  } = useCart();

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCloseAndScroll = () => {
    setIsCartOpen(false);
    const element = document.getElementById("menu-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#352519]/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#EEEBE7] shadow-2xl flex flex-col justify-between border-l border-[#352519]/15 animate-slide-up sm:animate-fade-in">
          
          {/* Header */}
          <div className="p-5 border-b border-[#352519]/10 flex items-center justify-between bg-[#EEEBE7]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#352519] text-[#EEEBE7] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#352519]">Keranjang Pesanan</h2>
                <span className="text-xs text-[#352519]/70 font-medium">
                  {totalItems} item dipilih
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-[#352519]/60 hover:text-[#352519] px-2.5 py-1.5 rounded-lg hover:bg-[#352519]/10 transition-colors"
                  title="Kosongkan Keranjang"
                >
                  Kosongkan
                </button>
              )}
              <button
                id="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-[#352519] hover:bg-[#352519]/10 transition-colors focus:outline-none"
                aria-label="Tutup Keranjang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-3xl bg-[#352519]/10 flex items-center justify-center text-[#352519] mb-4">
                  <Coffee className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#352519] mb-1">
                  Keranjang masih kosong.
                </h3>
                <p className="text-xs text-[#352519]/70 max-w-xs mb-6">
                  Yuk, pilih kopi dan snack favoritmu dari menu Bligus Coffee!
                </p>
                <button
                  id="empty-cart-see-menu"
                  onClick={handleCloseAndScroll}
                  className="px-6 py-3 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-xs hover:bg-[#251910] active:scale-95 transition-all shadow-sm"
                >
                  Lihat Menu
                </button>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.cartItemId} item={item} />)
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#352519]/15 bg-[#EEEBE7] shadow-lg space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#352519]/75">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#352519]/75">
                  <span>Biaya Layanan</span>
                  <span className="font-semibold text-[#352519]">Gratis (Rp0)</span>
                </div>
                <div className="pt-2 border-t border-[#352519]/10 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#352519]">Total Pembayaran</span>
                  <span className="text-lg font-black text-[#352519]">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm sm:text-base hover:bg-[#251910] active:scale-[0.98] transition-all shadow-warm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#352519]/40"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
