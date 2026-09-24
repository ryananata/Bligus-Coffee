"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoryFilter, FilterCategory } from "@/components/CategoryFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { CartDrawer } from "@/components/CartDrawer";
import { CartFloatingBar } from "@/components/CartFloatingBar";
import { ProductCustomizationModal } from "@/components/ProductCustomizationModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { PRODUCTS } from "@/data/products";
import { supabase } from "@/utils/supabase";
import { Product } from "@/types";
import { Search, Sparkles, X } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        const dbProducts: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          description: p.description,
          price: p.price,
          image: p.image_url,
          isAvailable: p.is_available,
          badge: p.badge,
        }));
        setProducts(dbProducts);
      }
    } catch (e: any) {
      console.error(e);
      setError("Gagal memuat menu dari server.");
    } finally {
      if (!isBackground) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProducts(false); // Initial load with spinner
    // Auto-refresh products silently every 5 seconds
    const interval = setInterval(() => fetchProducts(true), 5000);
    return () => clearInterval(interval);
  }, []);

  // Category counts calculation for all series
  const itemCounts = useMemo(() => {
    return {
      Semua: products.length,
      "Signature Series": products.filter((p) => p.category === "Signature Series").length,
      "Coffee Series": products.filter((p) => p.category === "Coffee Series").length,
      "Americano Series": products.filter((p) => p.category === "Americano Series").length,
      "Non-Coffee Series": products.filter((p) => p.category === "Non-Coffee Series").length,
      "BliGus Gabin": products.filter((p) => p.category === "BliGus Gabin").length,
      "Combo / Bundling": products.filter((p) => p.category === "Combo / Bundling").length,
    };
  }, [products]);

  // Filter & Search logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleRetry = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EEEBE7]">
      {/* Toast Notification */}
      <Toast />

      {/* Sticky Header */}
      <Header />

      {/* Main Hero Banner */}
      <main className="flex-1">
        <Hero />

        {/* Menu Section */}
        <section id="menu-section" className="py-10 sm:py-16 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#352519]/8 text-[#352519] text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Daftar Menu Resmi BliGus Coffee</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#352519] tracking-tight">
                  Menu BliGus Coffee
                </h2>
                <p className="text-sm sm:text-base text-[#352519]/75 mt-1 font-medium">
                  Pilih menu favoritmu dari Signature, Coffee, Americano, hingga Non-Coffee series.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#352519]/50">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="menu-search-input"
                  type="text"
                  placeholder="Cari kopi, caramel, klepon..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-[#352519]/15 text-sm text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:border-[#352519] focus:ring-2 focus:ring-[#352519]/20 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#352519]/50 hover:text-[#352519]"
                    aria-label="Hapus pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mb-8">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                itemCounts={itemCounts}
              />
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
            />

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />

      {/* Product Customization Modal (Add-ons for Coffee / Non-Coffee) */}
      <ProductCustomizationModal />

      {/* Cart Drawer (Desktop / Mobile overlay) */}
      <CartDrawer />

      {/* Mobile Bottom Sticky Floating Cart Bar */}
      <CartFloatingBar />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Order Confirmation Screen */}
      <OrderConfirmation />
    </div>
  );
}
