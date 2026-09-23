import React from "react";
import { Coffee, Heart, MapPin, Clock, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer id="about-section" className="bg-[#EEEBE7] border-t border-[#352519]/15 pt-12 pb-24 md:pb-12 text-[#352519]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#352519]/10">

          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#352519] overflow-hidden flex items-center justify-center border border-[#352519]/20 shadow-md shrink-0">
                <Image
                  src="/images/Logo/Logo_BliGus.PNG"
                  alt="Logo BliGus Coffee"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#352519] leading-none">
                  BliGus Coffee
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#352519]/70 tracking-wider uppercase mt-1">
                  Coffee & Dessert
                </span>
              </div>
            </div>
            <p className="font-serif italic text-base text-[#352519]/90">
              “Kopi dulu, dunia nanti.”
            </p>
            <p className="text-xs sm:text-sm text-[#352519]/75 leading-relaxed max-w-sm">
              Ruang hangat untuk menikmati seduhan kopi berkualitas, mengerjakan tugas, atau sekadar berbincang santai ditemani menu favoritmu.
            </p>
          </div>

          {/* Opening Hours & Info */}
          <div className="md:col-span-3 space-y-3" id="contact-section">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#352519]">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs text-[#352519]/80">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#352519] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#352519]">Senin – Minggu</p>
                  <p>09.00 – 22.00 WITA</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/1ZbeKRsUojTyK1Gb9?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 group p-2 -ml-2 rounded-xl hover:bg-[#352519]/5 transition-colors border border-transparent hover:border-[#352519]/15"
                title="Buka lokasi di Google Maps"
              >
                <MapPin className="w-4 h-4 text-[#352519] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-semibold text-[#352519] group-hover:underline">Lokasi Outlet</p>
                  <p className="text-[#352519]/80 leading-snug mt-0.5">
                    Jl. K.H. Samanhudi No.20 Subagan, Karangasem
                  </p>
                  <span className="inline-block text-[10px] font-bold text-[#352519] underline mt-1">
                    Buka di Google Maps ↗
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Direct Contact & Social */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#352519]">
              Layanan & Hubungi Kami
            </h4>
            <p className="text-xs text-[#352519]/75">
              Pertanyaan mengenai pesanan, reservasi tempat belajar, atau kerjasama katering:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://wa.me/6285714210505"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#352519]/8 hover:bg-[#352519] hover:text-[#EEEBE7] text-xs font-bold text-[#352519] transition-all border border-[#352519]/15"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/bligus.coffee/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#352519]/8 hover:bg-[#352519] hover:text-[#EEEBE7] text-xs font-bold text-[#352519] transition-all border border-[#352519]/15"
                title="Kunjungi Instagram @bligus.coffee"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>@bligus.coffee</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#352519]/60">
          <p>© {new Date().getFullYear()} BliGus Coffee. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/kasir"
              className="text-[11px] font-bold text-[#352519]/60 hover:text-[#352519] hover:underline flex items-center gap-1"
            >
              <span>🔒 Portal Kasir</span>
            </Link>
            <div className="flex items-center gap-1 font-medium">
              <span>Diseduh dengan</span>
              <Heart className="w-3.5 h-3.5 fill-[#352519] text-[#352519]" />
              <span>untuk penikmat kopi.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
