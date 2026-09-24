"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Coffee, Menu as MenuIcon, X } from "lucide-react";
import Image from "next/image";

export const Header: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
        ? "bg-[#EEEBE7]/95 backdrop-blur-md shadow-sm border-b border-[#352519]/10 py-3"
        : "bg-[#EEEBE7] py-4 md:py-5 border-b border-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#352519]/30 rounded-xl p-1"
          aria-label="Bligus Coffee Home"
        >
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-[#352519] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 border border-[#352519]/20 shrink-0">
            <Image
              src="/images/Logo/Logo_BliGus.PNG"
              alt="Logo BliGus Coffee"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#352519] leading-none">
              BliGus Coffee
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-[#352519]/70 tracking-wider uppercase mt-0.5">
              Est. 2026 • Coffee & Dessert
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#352519]">
          <button
            onClick={() => scrollToSection("menu-section")}
            className="hover:text-[#352519]/75 transition-colors focus:outline-none focus:underline"
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection("about-section")}
            className="hover:text-[#352519]/75 transition-colors focus:outline-none focus:underline"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => scrollToSection("contact-section")}
            className="hover:text-[#352519]/75 transition-colors focus:outline-none focus:underline"
          >
            Kontak & Lokasi
          </button>
        </nav>

        {/* Action Controls (Cart & Mobile Menu Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cart Icon Button */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-full sm:rounded-2xl bg-[#352519] text-[#EEEBE7] hover:bg-[#251910] active:scale-95 transition-all flex items-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#352519]/40"
            aria-label={`Buka Keranjang (${totalItems} item)`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              Keranjang
            </span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-black bg-[#EEEBE7] text-[#352519] rounded-full ring-2 ring-[#352519] animate-fade-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2.5 rounded-xl border border-[#352519]/15 text-[#352519] hover:bg-[#352519]/5 active:scale-95 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-[#352519]/10 bg-[#EEEBE7] px-4 pt-3 pb-4 animate-fade-in shadow-lg">
          <div className="flex flex-col gap-2 font-medium text-[#352519]">
            <button
              onClick={() => scrollToSection("menu-section")}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#352519]/10 font-semibold"
            >
              Menu Bligus Coffee
            </button>
            <button
              onClick={() => scrollToSection("about-section")}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#352519]/10"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollToSection("contact-section")}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-[#352519]/10"
            >
              Kontak & Jam Buka
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
