"use client";

import React from "react";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/utils/formatters";
import { Plus, Minus, Trash2, Sparkles } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#EEEBE7] border border-[#352519]/15 shadow-sm transition-all">
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#352519]/10 shrink-0 border border-[#352519]/10 mt-0.5">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-bold text-[#352519] truncate leading-tight">
            {item.product.name}
          </h4>
          <button
            onClick={() => removeFromCart(item.cartItemId)}
            className="text-[#352519]/50 hover:text-[#352519] p-1 rounded-lg hover:bg-[#352519]/10 transition-colors shrink-0"
            aria-label={`Hapus ${item.product.name} dari keranjang`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Add-ons Badges */}
        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.selectedAddOns.map((addOn) => (
              <span
                key={addOn.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#352519]/10 text-[#352519] text-[10px] font-bold"
              >
                <Sparkles className="w-2.5 h-2.5" />
                {addOn.name} (+{formatRupiah(addOn.price)})
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-[#352519]/70 mt-1">
          {formatRupiah(item.unitTotalPrice)} × {item.quantity}
        </div>

        {/* Subtotal & Stepper */}
        <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#352519]/10">
          <span className="text-sm font-extrabold text-[#352519]">
            {formatRupiah(item.unitTotalPrice * item.quantity)}
          </span>

          {/* Stepper Controls */}
          <div className="flex items-center gap-1.5 bg-[#352519]/8 rounded-xl p-1 border border-[#352519]/15">
            <button
              onClick={() => decreaseQuantity(item.cartItemId)}
              className="w-7 h-7 rounded-lg bg-[#EEEBE7] text-[#352519] hover:bg-white active:scale-90 flex items-center justify-center border border-[#352519]/15 transition-all"
              aria-label={`Kurangi ${item.product.name}`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <span className="w-6 text-center text-xs font-bold text-[#352519]">
              {item.quantity}
            </span>

            <button
              onClick={() => increaseQuantity(item.cartItemId)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-[#352519] text-[#EEEBE7] hover:bg-[#251910] active:scale-90 shadow-sm`}
              aria-label={`Tambah ${item.product.name}`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
