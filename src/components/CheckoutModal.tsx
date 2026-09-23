"use client";

import React, { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah, validateWhatsAppNumber } from "@/utils/formatters";
import {
  X,
  ArrowLeft,
  Send,
  User,
  Phone,
  FileText,
  ShoppingBag,
  QrCode,
  Upload,
  CheckCircle,
  Copy,
  Check,
  ImageIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import confetti from "canvas-confetti";

export const CheckoutModal: React.FC = () => {
  const {
    items,
    subtotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    createOrder,
    showToast,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; proof?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCheckoutOpen) return null;

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(subtotal.toString());
    setCopied(true);
    showToast("Nominal pembayaran disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, proof: "Harap upload file gambar (JPG atau PNG)." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, proof: "Ukuran file terlalu besar (maksimal 5MB)." }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
      setErrors((prev) => ({ ...prev, proof: undefined }));
      showToast("Bukti pembayaran berhasil di-upload");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; whatsapp?: string; proof?: string } = {};

    if (!customerName.trim()) {
      newErrors.name = "Nama pemesan wajib diisi.";
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi.";
    } else if (!validateWhatsAppNumber(whatsapp)) {
      newErrors.whatsapp = "Nomor WhatsApp tidak valid (contoh: 08123456789).";
    }

    if (items.length === 0) {
      alert("Keranjang pesanan masih kosong.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await createOrder(customerName, whatsapp, notes, proofImage || undefined);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#352519", "#EEEBE7", "#C0B8AD"],
        });
      } catch (err) {
        // Ignore confetti if unsupported
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#352519]/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => setIsCheckoutOpen(false)}
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 py-6 sm:py-8 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-[#EEEBE7] rounded-3xl shadow-2xl border border-[#352519]/15 overflow-hidden animate-slide-up z-10">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#352519]/10 flex items-center justify-between bg-[#EEEBE7]">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToCart}
                className="p-2 rounded-xl border border-[#352519]/15 text-[#352519] hover:bg-[#352519]/10 transition-colors"
                aria-label="Kembali ke keranjang"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#352519]">Checkout & Pembayaran</h2>
                <p className="text-xs text-[#352519]/70">Lengkapi data & scan QRIS untuk memesan</p>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-xl text-[#352519] hover:bg-[#352519]/10 transition-colors"
              aria-label="Tutup Checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* 1. Customer Details Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#352519]/80 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Data Pembeli
                </h3>

                {/* Nama Input */}
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-bold text-[#352519] mb-1.5">
                    Nama Lengkap <span className="text-[#352519] font-black">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#352519]/50">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="customer-name"
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border text-sm text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-[#352519] ring-1 ring-[#352519]/40"
                          : "border-[#352519]/20 focus:border-[#352519] focus:ring-[#352519]/20"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] font-bold text-[#352519] mt-1 pl-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* WhatsApp Input */}
                <div>
                  <label htmlFor="whatsapp-number" className="block text-xs font-bold text-[#352519] mb-1.5">
                    Nomor WhatsApp <span className="text-[#352519] font-black">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#352519]/50">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      id="whatsapp-number"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={whatsapp}
                      onChange={(e) => {
                        setWhatsapp(e.target.value);
                        if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                      }}
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white border text-sm text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:ring-2 ${
                        errors.whatsapp
                          ? "border-[#352519] ring-1 ring-[#352519]/40"
                          : "border-[#352519]/20 focus:border-[#352519] focus:ring-[#352519]/20"
                      }`}
                    />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-[11px] font-bold text-[#352519] mt-1 pl-1">
                      {errors.whatsapp}
                    </p>
                  )}
                  <p className="text-[10px] text-[#352519]/60 mt-1 pl-1">
                    Admin akan menghubungi nomor ini lewat WhatsApp ketika pesanan selesai dibuat.
                  </p>
                </div>

                {/* Notes Input */}
                <div>
                  <label htmlFor="order-notes" className="block text-xs font-bold text-[#352519] mb-1.5">
                    Catatan Khusus <span className="text-xs font-normal text-[#352519]/60">(Opsional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3.5 pointer-events-none text-[#352519]/50">
                      <FileText className="w-4 h-4" />
                    </div>
                    <textarea
                      id="order-notes"
                      rows={2}
                      placeholder="Contoh: Less ice, gula sedikit, ambil jam 15.00 WITA"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#352519]/20 text-sm text-[#352519] placeholder:text-[#352519]/40 focus:outline-none focus:border-[#352519] focus:ring-2 focus:ring-[#352519]/20 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. QRIS Payment Section */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#352519]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#352519] flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#352519]" />
                    Pembayaran QRIS
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#352519]/10 text-[#352519]">
                    Semua E-Wallet & Bank
                  </span>
                </div>

                {/* QRIS Image Display */}
                <div className="relative w-full max-w-xs mx-auto aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-[#352519]/15 shadow-sm bg-white p-2">
                  <Image
                    src="/images/qris/qris_bligus.jpeg"
                    alt="QRIS Resmi BliGus Coffee"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Total Box */}
                <div className="p-3.5 rounded-2xl bg-[#EEEBE7] border border-[#352519]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#352519]/70 font-medium block">
                      Total Pembayaran
                    </span>
                    <span className="text-xl font-black text-[#352519] tracking-tight">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTotal}
                    className="px-3 py-2 rounded-xl bg-[#352519] text-[#EEEBE7] text-xs font-bold hover:bg-[#251910] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Total</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Bukti Transfer Section */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#352519] flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Bukti Transfer
                  </h3>
                  <p className="text-xs text-[#352519]/70 mt-0.5">
                    Upload screenshot / foto bukti pembayaran kamu.
                  </p>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {!proofImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 rounded-2xl bg-white border-2 border-dashed border-[#352519]/25 hover:border-[#352519] cursor-pointer text-center transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#352519]/8 group-hover:bg-[#352519]/15 flex items-center justify-center mx-auto mb-2 text-[#352519] transition-colors">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#352519]">
                      Pilih foto bukti transfer
                    </p>
                    <p className="text-[11px] text-[#352519]/60 mt-0.5">
                      JPG, PNG, atau Screenshot (Maks 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative p-3 bg-white rounded-2xl border border-[#352519]/15 flex items-center justify-between gap-3 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image
                          src={proofImage}
                          alt="Bukti Transfer"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-xs font-bold text-[#352519]">
                          <CheckCircle className="w-3.5 h-3.5 text-green-700" />
                          <span>Bukti Terpasang</span>
                        </div>
                        <p className="text-[11px] text-[#352519]/60 truncate">
                          Siap dikirimkan ke barista
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#352519] hover:bg-[#352519]/10 transition-colors"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={() => setProofImage(null)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Bukti"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                {errors.proof && (
                  <p className="text-[11px] font-bold text-[#352519] pl-1">
                    {errors.proof}
                  </p>
                )}
              </div>

              {/* 4. Order Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-[#352519]/5 border border-[#352519]/10 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#352519]/10">
                  <h3 className="text-xs font-bold text-[#352519] uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Ringkasan Pesanan
                  </h3>
                  <span className="text-[11px] font-bold text-[#352519]/70">
                    {items.length} Menu
                  </span>
                </div>

                <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#352519]/5 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <span className="font-bold text-[#352519]">{item.product.name}</span>
                          <span className="text-[#352519]/60 ml-1">× {item.quantity}</span>
                        </div>
                        <span className="font-extrabold text-[#352519]">
                          {formatRupiah(item.unitTotalPrice * item.quantity)}
                        </span>
                      </div>

                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-[11px] text-[#352519]/70 pl-2 italic">
                          + {item.selectedAddOns.map((a) => `${a.name} (${formatRupiah(a.price)})`).join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-[#352519]/10 flex items-center justify-between text-sm font-extrabold text-[#352519]">
                  <span>Total Pembayaran</span>
                  <span className="text-base">{formatRupiah(subtotal)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-5 border-t border-[#352519]/10 bg-[#EEEBE7]">
              <button
                id="submit-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm sm:text-base hover:bg-[#251910] active:scale-[0.98] transition-all shadow-warm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#352519]/40 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <span>Lanjut Pemesanan</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
