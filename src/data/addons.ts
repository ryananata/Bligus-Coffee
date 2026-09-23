import { AddOn, Product, ProductCategory } from "@/types";

export const ADDONS_MAP: Record<string, AddOn> = {
  espresso_shot: {
    id: "espresso_shot",
    name: "+1 Shot Espresso",
    price: 3000,
  },
  foam_milk: {
    id: "foam_milk",
    name: "+Foam Milk",
    price: 3000,
  },
  sea_salt_cream: {
    id: "sea_salt_cream",
    name: "Sea Salt Cream",
    price: 5000,
  },
  coller_bag: {
    id: "coller_bag",
    name: "Coller Bag",
    price: 3000,
  },
};

// Hanya 1 Shot Espresso untuk Americano Series, Signature Series, serta khusus Cappuccino & Dalgona
export const ESPRESSO_ONLY_ADDONS: AddOn[] = [
  ADDONS_MAP.espresso_shot,
];

// Lengkap (Espresso, Foam Milk, Sea Salt Cream) untuk Coffee Series lainnya
export const COFFEE_SERIES_ADDONS: AddOn[] = [
  ADDONS_MAP.espresso_shot,
  ADDONS_MAP.foam_milk,
  ADDONS_MAP.sea_salt_cream,
];

// Foam Milk & Sea Salt Cream untuk Non-Coffee Series
export const NON_COFFEE_SERIES_ADDONS: AddOn[] = [
  ADDONS_MAP.foam_milk,
  ADDONS_MAP.sea_salt_cream,
];

/**
 * Returns available add-ons based on product / category rules:
 * - Signature Series: ONLY +1 Shot Espresso (3K)
 * - Americano Series: ONLY +1 Shot Espresso (3K)
 * - Cappuccino & Dalgona: ONLY +1 Shot Espresso (3K) - Tidak ada Foam Milk & Sea Salt Cream
 * - Coffee Series Lainnya: +1 Shot Espresso (3K), +Foam Milk (3K), Sea Salt Cream (5K)
 * - Non-Coffee Series: +Foam Milk (3K), Sea Salt Cream (5K)
 */
export function getAddOnsForProduct(product: Product | { name: string; category: ProductCategory }): AddOn[] {
  const name = (product.name || "").toLowerCase();

  // Khusus Cappuccino dan Dalgona: CUMA ADA +1 SHOT ESPRESSO
  if (
    name.includes("cappuccino") ||
    name.includes("capucino") ||
    name.includes("cappucino") ||
    name.includes("dalgona")
  ) {
    return ESPRESSO_ONLY_ADDONS;
  }

  // Signature & Americano: ONLY +1 Shot Espresso
  if (product.category === "Signature Series" || product.category === "Americano Series") {
    return ESPRESSO_ONLY_ADDONS;
  }

  // Coffee Series lainnya: Lengkap
  if (product.category === "Coffee Series") {
    return COFFEE_SERIES_ADDONS;
  }

  // Non-Coffee Series: Foam Milk & Sea Salt Cream
  if (product.category === "Non-Coffee Series") {
    return NON_COFFEE_SERIES_ADDONS;
  }

  // Gabin & Combos: Coller Bag
  if (product.category === "BliGus Gabin" || product.category === "Combo / Bundling") {
    return [ADDONS_MAP.coller_bag];
  }

  return [];
}

/**
 * Fallback / General category helper
 */
export function getAddOnsForCategory(category: ProductCategory): AddOn[] {
  if (category === "Signature Series" || category === "Americano Series") {
    return ESPRESSO_ONLY_ADDONS;
  }
  if (category === "Coffee Series") {
    return COFFEE_SERIES_ADDONS;
  }
  if (category === "Non-Coffee Series") {
    return NON_COFFEE_SERIES_ADDONS;
  }
  if (category === "BliGus Gabin" || category === "Combo / Bundling") {
    return [ADDONS_MAP.coller_bag];
  }
  return [];
}
