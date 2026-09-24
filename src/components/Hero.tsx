"use client";

import React from "react";
import { ArrowDown, Sparkles, Clock, Flame, ThumbsUp } from "lucide-react";
import Image from "next/image";

export const Hero: React.FC = () => {
  const scrollToMenu = () => {
    const element = document.getElementById("menu-section");
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-10 md:pt-12 md:pb-16 bg-[#EEEBE7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#352519]/8 border border-[#352519]/15 text-[#352519] text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Freshly Brewed Every Day</span>
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#352519] leading-[1.12]">
              BliGus Coffee
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#352519]/90 font-medium mt-2 md:mt-3">
              “Kopi dulu, dunia nanti.”
            </p>

            <p className="text-sm sm:text-base text-[#352519]/75 mt-4 max-w-lg leading-relaxed font-normal">
              Temukan racikan kopi signature dan aneka varian minuman favoritmu dari BliGus Coffee, lalu pesan langsung dengan mudah dan cepat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-6 sm:mt-8 w-full sm:w-auto">
              <button
                id="hero-see-menu-btn"
                onClick={scrollToMenu}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm sm:text-base hover:bg-[#251910] active:scale-95 transition-all duration-200 shadow-warm flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#352519]/40"
              >
                <span>Lihat Menu</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#352519]/5 border border-[#352519]/10 text-xs font-medium text-[#352519]/80 w-full sm:w-auto justify-center sm:justify-start">
                <Clock className="w-4 h-4 text-[#352519]" />
                <span>Buka: 09.00 - 22.00 WITA</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 pt-6 border-t border-[#352519]/10 w-full max-w-lg">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-[#352519]">100%</span>
                <span className="text-[11px] sm:text-xs text-[#352519]/70">Biji Kopi Robusta</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-[#352519]">Cepat</span>
                <span className="text-[11px] sm:text-xs text-[#352519]/70">Pesan Tanpa Antre</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-[#352519]">Fresh</span>
                <span className="text-[11px] sm:text-xs text-[#352519]/70">Dibuat Saat Dipesan</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none bg-[#352519]/5 p-4 sm:p-6 rounded-3xl border border-[#352519]/15 shadow-warm">
              {/* Featured Visual Card with Official Product Photo */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#352519] to-[#251910] text-[#EEEBE7] p-5 sm:p-6 flex flex-col justify-between shadow-inner min-h-[290px]">

                <div className="flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm">
                    Signature Series
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#EEEBE7]">
                    <ThumbsUp className="w-3.5 h-3.5 fill-[#EEEBE7]" />
                    <span>Best Seller No. 1</span>
                  </div>
                </div>

                {/* Centered Image */}
                <div className="relative w-full h-36 my-2 z-10 flex items-center justify-center">
                  <Image
                    src="/images/products/kopi_susu_bligus.png"
                    alt="Kopi Susu BliGus"
                    fill
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>

                <div className="z-10 mt-auto pt-2 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      Kopi Susu BliGus
                    </h3>
                    <span className="text-base font-extrabold text-[#EEEBE7]">
                      Rp18.000
                    </span>
                  </div>
                  <button
                    onClick={scrollToMenu}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-[#EEEBE7] text-[#352519] hover:bg-white active:scale-95 transition-all shadow-sm"
                  >
                    Pesan
                  </button>
                </div>
              </div>

              {/* Little Floating Banner */}
              <div className="mt-3 flex items-center justify-between px-3 py-2 bg-[#EEEBE7] rounded-xl border border-[#352519]/10 text-xs text-[#352519]/80">
                <span className="font-semibold text-[#352519]">📍 Ambil langsung di Pick Up Point</span>
                <span className="text-[11px]">Tentukan jam pengambilan di kolom catatan</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
