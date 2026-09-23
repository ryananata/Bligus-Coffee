"use client";

import React from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { Coffee, AlertTriangle, RefreshCw } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  error,
  onRetry,
}) => {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#352519]/5 rounded-3xl border border-[#352519]/15 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#352519]/10 flex items-center justify-center text-[#352519] mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#352519] mb-1">Gagal memuat menu.</h3>
        <p className="text-sm text-[#352519]/70 max-w-sm mb-6">
          {error || "Terjadi kesalahan saat mengambil daftar produk. Silakan coba kembali."}
        </p>
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm hover:bg-[#251910] active:scale-95 transition-all shadow-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  // 3. Empty Menu State
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#352519]/5 rounded-3xl border border-[#352519]/15 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#352519]/10 flex items-center justify-center text-[#352519] mb-4">
          <Coffee className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#352519] mb-1">Belum ada menu yang tersedia.</h3>
        <p className="text-sm text-[#352519]/70 max-w-sm">
          Menu dalam kategori ini saat ini belum tersedia. Silakan pilih kategori lainnya.
        </p>
      </div>
    );
  }

  // 4. Products Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
