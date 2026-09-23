"use client";

import React from "react";
import { ProductCategory } from "@/types";
import { Coffee, CupSoda, Flame, Sparkles, LayoutGrid, Cookie, Package } from "lucide-react";

export type FilterCategory = "Semua" | ProductCategory;

interface CategoryFilterProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  itemCounts: {
    Semua: number;
    "Signature Series": number;
    "Coffee Series": number;
    "Americano Series": number;
    "Non-Coffee Series": number;
    "BliGus Gabin": number;
    "Combo / Bundling": number;
  };
}

const CATEGORIES: { id: FilterCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "Semua", label: "Semua Menu", icon: LayoutGrid },
  { id: "Signature Series", label: "Signature Series", icon: Sparkles },
  { id: "Coffee Series", label: "Coffee Series", icon: Coffee },
  { id: "Americano Series", label: "Americano Series", icon: Flame },
  { id: "Non-Coffee Series", label: "Non-Coffee Series", icon: CupSoda },
  { id: "BliGus Gabin", label: "BliGus Gabin", icon: Cookie },
  { id: "Combo / Bundling", label: "Combo / Bundling", icon: Package },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  itemCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#352519]/30 ${
                isSelected
                  ? "bg-[#352519] text-[#EEEBE7] border-[#352519] shadow-warm scale-[1.02]"
                  : "bg-[#EEEBE7] text-[#352519] border-[#352519]/15 hover:border-[#352519]/40 hover:bg-[#352519]/5"
              }`}
              aria-label={`Filter kategori ${cat.label}`}
              aria-pressed={isSelected}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-[#EEEBE7]" : "text-[#352519]/70"}`} />
              <span>{cat.label}</span>
              <span
                className={`ml-0.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isSelected
                    ? "bg-[#EEEBE7] text-[#352519]"
                    : "bg-[#352519]/10 text-[#352519]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
