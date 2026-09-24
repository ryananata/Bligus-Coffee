"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/utils/formatters";
import { isStoreOpen } from "@/utils/storeHours";
import { Plus, Minus, AlertCircle, Sparkles, SlidersHorizontal, ThumbsUp, Flame } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    items,
    getProductTotalQuantity,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    setCustomizingProduct,
  } = useCart();

  const totalQuantity = getProductTotalQuantity(product.id);
  const isOutOfStock = !product.isAvailable;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);

  useEffect(() => {
    setStoreOpen(isStoreOpen());
  }, []);

  const isUnavailable = isOutOfStock || !storeOpen;

  // Find standard (no-addon) item if present in cart
  const standardCartItem = items.find(
    (item) => item.product.id === product.id && item.selectedAddOns.length === 0
  );
  const anyCartItem = items.find((item) => item.product.id === product.id);

  const handleCardAddClick = () => {
    if (!isUnavailable) {
      setCustomizingProduct(product);
    }
  };

  const handleQuickIncrease = () => {
    if (standardCartItem) {
      increaseQuantity(standardCartItem.cartItemId);
    } else if (anyCartItem) {
      increaseQuantity(anyCartItem.cartItemId);
    } else {
      addToCart(product, 1, []);
    }
  };

  const handleQuickDecrease = () => {
    if (standardCartItem) {
      decreaseQuantity(standardCartItem.cartItemId);
    } else if (anyCartItem) {
      decreaseQuantity(anyCartItem.cartItemId);
    }
  };

  const getAvailabilityBadge = () => {
    if (!storeOpen) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#352519]/20 text-[#352519] border border-[#352519]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#352519]" />
          Toko Tutup
        </span>
      );
    }
    if (isOutOfStock) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#352519]/20 text-[#352519] border border-[#352519]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#352519]" />
          Tidak Tersedia
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#352519]/5 text-[#352519]/80 border border-[#352519]/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#352519]" />
        Tersedia
      </span>
    );
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group flex flex-col justify-between bg-[#EEEBE7] rounded-3xl p-4 sm:p-5 border transition-all duration-300 ${
        totalQuantity > 0
          ? "border-[#352519] shadow-warm ring-1 ring-[#352519]/20"
          : "border-[#352519]/15 hover:border-[#352519]/40 hover:shadow-warm"
      } ${isOutOfStock ? "opacity-75" : ""}`}
    >
      <div>
        {/* Product Image Area */}
        <div
          onClick={() => !isUnavailable && setCustomizingProduct(product)}
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-[#352519]/5 to-[#352519]/10 border border-[#352519]/10 mb-4 cursor-pointer p-2 flex items-center justify-center"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-2 transition-transform duration-500 group-hover:scale-105 drop-shadow-md ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={product.id <= 6}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#352519]/5 animate-pulse flex items-center justify-center">
              <span className="text-xs font-medium text-[#352519]/40">{product.name}</span>
            </div>
          )}

          {/* Top Badges (Category & Stock) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-xl bg-[#EEEBE7]/95 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold text-[#352519] shadow-sm border border-[#352519]/10">
              {product.category}
            </span>
            <div className="bg-[#EEEBE7]/95 backdrop-blur-sm rounded-xl shadow-sm">
              {getAvailabilityBadge()}
            </div>
          </div>

          {/* Special Official Menu Tags (Best Seller or New) */}
          {product.badge === "Best Seller" && (
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#352519] text-[#EEEBE7] text-[10px] font-extrabold shadow-sm">
                <ThumbsUp className="w-3 h-3 fill-[#EEEBE7]" />
                Best Seller
              </span>
            </div>
          )}

          {product.badge === "New" && (
            <div className="absolute bottom-2.5 left-2.5 pointer-events-none z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#352519] text-[#EEEBE7] text-[10px] font-extrabold shadow-sm border border-[#EEEBE7]/20">
                <Flame className="w-3 h-3 text-[#EEEBE7]" />
                Menu Baru
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[#352519] leading-snug tracking-tight">
            {product.name}
          </h3>

          <p className="text-xs text-[#352519]/75 mt-1.5 line-clamp-2 leading-relaxed font-normal min-h-[36px]">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing & Interactive Action Controls */}
      <div className="mt-4 pt-3.5 border-t border-[#352519]/10 flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs text-[#352519]/60 font-medium block">Harga</span>
            <span className="text-lg font-extrabold text-[#352519] tracking-tight">
              {formatRupiah(product.price)}
            </span>
          </div>
            <span className="text-[11px] font-semibold text-[#352519]/70">
            </span>
        </div>

        {/* Action Button / Inline Quantity Stepper */}
        {totalQuantity === 0 ? (
          <button
            id={`add-btn-${product.id}`}
            onClick={handleCardAddClick}
            disabled={isUnavailable}
            className={`w-full py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#352519]/40 ${
              isUnavailable
                ? "bg-[#352519]/10 text-[#352519]/40 cursor-not-allowed border border-[#352519]/10"
                : "bg-[#352519] text-[#EEEBE7] hover:bg-[#251910] active:scale-[0.98] shadow-sm"
            }`}
            aria-label={!storeOpen ? "Toko Tutup" : isOutOfStock ? `${product.name} tidak tersedia` : `Pesan ${product.name}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{!storeOpen ? "Toko Tutup" : "+ Kustom / Tambah"}</span>
          </button>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between bg-[#352519]/8 rounded-2xl p-1 border border-[#352519]/20">
              <button
                id={`card-dec-${product.id}`}
                onClick={handleQuickDecrease}
                className="w-9 h-9 rounded-xl bg-[#EEEBE7] text-[#352519] hover:bg-white active:scale-90 transition-all flex items-center justify-center border border-[#352519]/15 shadow-sm focus:outline-none"
                aria-label={`Kurangi jumlah ${product.name}`}
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="flex flex-col items-center px-2">
                <span className="text-sm font-extrabold text-[#352519] leading-none">
                  {totalQuantity}
                </span>
                <span className="text-[10px] text-[#352519]/60 font-medium">di keranjang</span>
              </div>

              <button
                id={`card-inc-${product.id}`}
                onClick={handleQuickIncrease}
                disabled={isUnavailable}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all focus:outline-none shadow-sm ${
                  isUnavailable 
                    ? "bg-[#352519]/10 text-[#352519]/40 border-[#352519]/10 cursor-not-allowed" 
                    : "bg-[#352519] text-[#EEEBE7] hover:bg-[#251910] active:scale-90 border-[#352519]"
                }`}
                aria-label={`Tambah jumlah ${product.name}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Customization modal trigger */}
            <button
                onClick={() => setCustomizingProduct(product)}
                className="text-[11px] font-bold text-[#352519] hover:underline flex items-center justify-center gap-1 py-0.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>+ Tambah Add-on Lainnya</span>
              </button>


          </div>
        )}
      </div>
    </div>
  );
};
