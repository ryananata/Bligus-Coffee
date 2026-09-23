"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { AddOn } from "@/types";
import { getAddOnsForProduct } from "@/data/addons";
import { formatRupiah } from "@/utils/formatters";
import { X, Plus, Minus, Check, Sparkles, Coffee } from "lucide-react";
import Image from "next/image";

export const ProductCustomizationModal: React.FC = () => {
  const { customizingProduct, setCustomizingProduct, addToCart } = useCart();
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reset state when a new product is selected
  useEffect(() => {
    if (customizingProduct) {
      setSelectedAddOns([]);
      setQuantity(1);
    }
  }, [customizingProduct]);

  if (!customizingProduct) return null;

  const availableAddOns = getAddOnsForProduct(customizingProduct);

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addOn.id);
      if (exists) {
        return prev.filter((a) => a.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = customizingProduct.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const result = addToCart(customizingProduct, quantity, selectedAddOns);
    if (result.success) {
      setCustomizingProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#352519]/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setCustomizingProduct(null)}
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-[#EEEBE7] rounded-3xl shadow-2xl border border-[#352519]/20 overflow-hidden animate-slide-up z-10">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#352519]/10 flex items-center justify-between bg-[#EEEBE7]">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-[#352519] text-[#EEEBE7] text-[11px] font-bold uppercase tracking-wider">
                {customizingProduct.category}
              </span>
              <span className="text-xs text-[#352519]/70 font-medium">
                Kustomisasi Minuman
              </span>
            </div>

            <button
              id="close-customize-modal"
              onClick={() => setCustomizingProduct(null)}
              className="p-2 rounded-xl text-[#352519] hover:bg-[#352519]/10 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Product Summary Row */}
            <div className="flex items-center gap-4 p-3.5 bg-white rounded-2xl border border-[#352519]/10 shadow-sm">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#352519]/10 shrink-0 border border-[#352519]/10">
                <Image
                  src={customizingProduct.image}
                  alt={customizingProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[#352519] leading-tight truncate">
                  {customizingProduct.name}
                </h3>
                <p className="text-xs text-[#352519]/70 line-clamp-2 mt-0.5">
                  {customizingProduct.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#352519]/10">
                  <span className="text-sm font-extrabold text-[#352519]">
                    {formatRupiah(customizingProduct.price)}
                  </span>
                  <span className="text-[11px] font-semibold text-[#352519]/70">
                  </span>
                </div>
              </div>
            </div>

            {/* Add-on Options Section */}
            {availableAddOns.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#352519] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Pilih Add-on (Opsional)
                  </h4>
                  <span className="text-[11px] text-[#352519]/60 font-medium">Bisa pilih lebih dari satu</span>
                </div>

                <div className="space-y-2">
                  {availableAddOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.id === addOn.id);

                    return (
                      <div
                        key={addOn.id}
                        id={`addon-option-${addOn.id}`}
                        onClick={() => toggleAddOn(addOn)}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                          isSelected
                            ? "bg-[#352519] text-[#EEEBE7] border-[#352519] shadow-sm"
                            : "bg-white text-[#352519] border-[#352519]/15 hover:border-[#352519]/35 hover:bg-[#352519]/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                              isSelected
                                ? "bg-[#EEEBE7] text-[#352519] border-[#EEEBE7]"
                                : "bg-white border-[#352519]/30"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-bold">{addOn.name}</span>
                        </div>

                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-xl ${
                            isSelected
                              ? "bg-[#EEEBE7]/20 text-[#EEEBE7]"
                              : "bg-[#352519]/8 text-[#352519]"
                          }`}
                        >
                          +{formatRupiah(addOn.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#352519]/10 shadow-sm">
              <span className="text-xs font-bold text-[#352519]">Jumlah Pesanan</span>

              <div className="flex items-center gap-2 bg-[#352519]/8 rounded-xl p-1 border border-[#352519]/15">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-[#EEEBE7] text-[#352519] hover:bg-white active:scale-90 flex items-center justify-center border border-[#352519]/15 disabled:opacity-40"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>

                <span className="w-8 text-center text-sm font-extrabold text-[#352519]">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-[#352519] text-[#EEEBE7] hover:bg-[#251910] active:scale-90 flex items-center justify-center shadow-sm"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </div>

          {/* Modal Footer CTA */}
          <div className="p-4 sm:p-6 border-t border-[#352519]/10 bg-[#EEEBE7]">
            <button
              id="confirm-add-to-cart-btn"
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm sm:text-base hover:bg-[#251910] active:scale-[0.98] transition-all shadow-warm flex items-center justify-between px-5 focus:outline-none focus:ring-2 focus:ring-[#352519]/40"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </div>
              <span className="text-sm font-black bg-[#EEEBE7]/15 px-3 py-1 rounded-xl backdrop-blur-sm">
                {formatRupiah(totalPrice)}
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
