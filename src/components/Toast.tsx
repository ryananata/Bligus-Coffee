"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle2 } from "lucide-react";

export const Toast: React.FC = () => {
  const { activeToast } = useCart();

  if (!activeToast) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-fade-in max-w-sm pointer-events-none">
      <div className="bg-[#352519] text-[#EEEBE7] px-4 py-3 rounded-2xl shadow-warm-lg flex items-center gap-3 border border-[#352519]/20 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#EEEBE7]/80 shrink-0" />
        <span>{activeToast}</span>
      </div>
    </div>
  );
};
