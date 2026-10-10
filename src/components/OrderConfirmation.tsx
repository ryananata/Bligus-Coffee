"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/utils/formatters";
import {
  CheckCircle,
  User,
  Phone,
  FileText,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ImageIcon,
  Printer,
} from "lucide-react";
import Image from "next/image";

export const OrderConfirmation: React.FC = () => {
  const { lastOrder, setLastOrder } = useCart();

  if (!lastOrder) return null;

  const handleCloseAndReturn = () => {
    setLastOrder(null);
    const element = document.getElementById("menu-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrintReceipt = async () => {
    // Format untuk printer thermal 58mm (kurang lebih 32 karakter per baris)
    let struk = `          BLIGUS COFFEE\n`;
    struk += `--------------------------------\n`;
    struk += `No: ${lastOrder.id}\n`;
    struk += `Nama: ${lastOrder.customerName}\n`;
    struk += `--------------------------------\n`;
    
    lastOrder.items.forEach(item => {
      struk += `${item.name}\n`;
      const qtyPrice = `${item.quantity}x ${item.unitTotalPrice || item.price}`;
      const subtotal = `${item.subtotal}`;
      const spaceCount = Math.max(1, 32 - qtyPrice.length - subtotal.length);
      struk += `${qtyPrice}${" ".repeat(spaceCount)}${subtotal}\n`;
    });
    
    struk += `--------------------------------\n`;
    const totalText = "TOTAL";
    const totalAmt = `${lastOrder.total}`;
    const totalSpace = Math.max(1, 32 - totalText.length - totalAmt.length);
    struk += `${totalText}${" ".repeat(totalSpace)}${totalAmt}\n`;
    struk += `--------------------------------\n`;
    struk += `          TERIMA KASIH\n\n\n`;

    try {
      // Pastikan browser mendukung WebUSB API
      if (!navigator.usb) {
        alert("Browser ini tidak mendukung cetak langsung via USB (WebUSB API). Gunakan Chrome untuk Android/PC.");
        return;
      }

      // Meminta pengguna memilih printer (tanpa filter spesifik agar semua USB muncul)
      const device = await navigator.usb.requestDevice({ filters: [] });
      
      await device.open();
      
      // Pilih konfigurasi default (biasanya 1)
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      
      // Cari interface dan endpoint untuk pengiriman data (direction 'out', type 'bulk')
      let outEndpoint = null;
      let targetInterface = null;

      for (const iface of device.configuration.interfaces) {
        for (const endpoint of iface.alternates[0].endpoints) {
          if (endpoint.direction === 'out' && endpoint.type === 'bulk') {
            outEndpoint = endpoint.endpointNumber;
            targetInterface = iface.interfaceNumber;
            break;
          }
        }
        if (outEndpoint) break;
      }

      if (outEndpoint === null || targetInterface === null) {
        throw new Error("Tidak menemukan endpoint printer yang sesuai.");
      }

      await device.claimInterface(targetInterface);

      // Siapkan perintah ESC/POS
      const encoder = new TextEncoder();
      
      // Init printer (ESC @)
      const initCmd = new Uint8Array([0x1B, 0x40]); 
      // Teks struk
      const textCmd = encoder.encode(struk);
      // Feed & Cut (LF x3 + GS V 0)
      const cutCmd = new Uint8Array([0x0A, 0x0A, 0x0A, 0x1D, 0x56, 0x00]); 

      // Gabungkan semua perintah
      const data = new Uint8Array(initCmd.length + textCmd.length + cutCmd.length);
      data.set(initCmd, 0);
      data.set(textCmd, initCmd.length);
      data.set(cutCmd, initCmd.length + textCmd.length);

      // Kirim data ke printer
      await device.transferOut(outEndpoint, data);

      // Tutup koneksi dengan bersih
      await device.releaseInterface(targetInterface);
      await device.close();
      
      alert("Struk berhasil dicetak!");

    } catch (error: any) {
      console.error(error);
      alert("Gagal mencetak: " + (error.message || "Pastikan printer menyala dan terhubung."));
    }
  };

  // WhatsApp formatted notification message
  const itemsText = lastOrder.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} = ${formatRupiah(item.subtotal)}${
          item.addOns && item.addOns.length > 0
            ? `\n  Add-ons: ${item.addOns.join(", ")}`
            : ""
        }`
    )
    .join("\n");

  const waMessage = encodeURIComponent(
    `Halo BliGus Coffee! Saya telah membuat pesanan baru:\n\n*No. Pesanan:* ${lastOrder.id}\n*Nama:* ${lastOrder.customerName}\n*Nomor WA:* ${lastOrder.whatsapp}\n\n*Rincian Menu:*\n${itemsText}\n\n*Total:* ${formatRupiah(lastOrder.total)}${
      lastOrder.notes ? `\n*Catatan:* ${lastOrder.notes}` : ""
    }${
      lastOrder.proofImage ? `\n*Status:* Bukti transfer telah dilampirkan` : ""
    }\n\nMohon dicek dan dihubungi jika pesanan sudah jadi ya, terima kasih!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#352519]/60 backdrop-blur-md transition-opacity animate-fade-in" />

      <div className="min-h-screen px-4 py-6 sm:py-8 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-[#EEEBE7] rounded-3xl shadow-2xl border border-[#352519]/20 overflow-hidden animate-slide-up z-10">
          
          {/* Top Success Banner */}
          <div className="bg-[#352519] text-[#EEEBE7] p-6 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#EEEBE7] text-[#352519] flex items-center justify-center mx-auto mb-3 shadow-md animate-pulse-subtle">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pesanan Berhasil!
            </h1>
            <p className="text-xs sm:text-sm text-[#EEEBE7]/80 mt-1">
              Terima kasih, pesananmu sudah kami terima dan siap diracik barista.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEEBE7]/15 border border-[#EEEBE7]/20 text-xs font-mono font-bold tracking-wider">
              <span>Nomor Pesanan:</span>
              <span className="text-[#EEEBE7]">{lastOrder.id}</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            
            {/* WhatsApp Notification Highlight Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#352519]/15 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#352519] uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>Informasi Pengambilan</span>
              </div>
              <p className="text-xs sm:text-sm text-[#352519]/85 leading-relaxed">
                Admin <strong>BliGus Coffee</strong> akan segera menghubungi kamu melalui WhatsApp di nomor{" "}
                <strong className="text-[#352519] underline">{lastOrder.whatsapp}</strong> ketika pesanan sudah selesai dan siap diambil di outlet!
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-[#352519]/10">
                <div className="flex items-center gap-1.5 text-[#352519]/60 font-medium mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Nama Pemesan</span>
                </div>
                <span className="font-bold text-[#352519] text-sm block truncate">
                  {lastOrder.customerName}
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#352519]/10">
                <div className="flex items-center gap-1.5 text-[#352519]/60 font-medium mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </div>
                <span className="font-bold text-[#352519] text-sm block truncate">
                  {lastOrder.whatsapp}
                </span>
              </div>
            </div>

            {/* Notes if present */}
            {lastOrder.notes && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#352519]/10 text-xs">
                <div className="flex items-center gap-1.5 text-[#352519]/60 font-medium mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Catatan Khusus</span>
                </div>
                <p className="font-medium text-[#352519] italic">
                  "{lastOrder.notes}"
                </p>
              </div>
            )}

            {/* Bukti Transfer if uploaded */}
            {lastOrder.proofImage && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#352519]/10 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#352519] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#352519]" />
                    Bukti Transfer Terlampir
                  </span>
                  <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    Terverifikasi
                  </span>
                </div>
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <Image
                    src={lastOrder.proofImage}
                    alt="Bukti Transfer"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Itemized Order List */}
            <div className="bg-white p-4 rounded-2xl border border-[#352519]/10 space-y-3">
              <h3 className="text-xs font-bold text-[#352519] uppercase tracking-wider pb-2 border-b border-[#352519]/10 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Rincian Menu ({lastOrder.items.length} item)
              </h3>

              <div className="space-y-2.5">
                {lastOrder.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5 text-xs pb-2 border-b border-[#352519]/5 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#352519]">{item.name}</span>
                        <span className="text-[#352519]/60 ml-1.5">
                          {formatRupiah(item.unitTotalPrice || item.price)} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-extrabold text-[#352519]">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>

                    {item.addOns && item.addOns.length > 0 && (
                      <p className="text-[11px] text-[#352519]/70 pl-2 italic">
                        + {item.addOns.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#352519]/10 flex items-center justify-between">
                <span className="text-sm font-bold text-[#352519]">Total Pembayaran</span>
                <span className="text-lg font-black text-[#352519]">
                  {formatRupiah(lastOrder.total)}
                </span>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 border-t border-[#352519]/10 bg-[#EEEBE7] flex flex-col sm:flex-row items-center gap-3">
            <button
              id="return-to-menu-btn"
              onClick={handleCloseAndReturn}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#352519] text-[#EEEBE7] font-bold text-sm hover:bg-[#251910] active:scale-[0.98] transition-all shadow-warm flex items-center justify-center gap-2"
            >
              <span>Kembali ke Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl border border-[#352519]/25 bg-white text-[#352519] font-bold text-xs hover:bg-[#352519]/5 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk</span>
            </button>

            <a
              href={`https://wa.me/6285714210505?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl border border-[#352519]/25 bg-white text-[#352519] font-bold text-xs hover:bg-[#352519]/5 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>Kirim WhatsApp</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
