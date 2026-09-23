import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Bligus Coffee — Kopi dulu, dunia nanti.",
  description: "Website pemesanan resmi Bligus Coffee. Pesan kopi, minuman non-kopi, dan snack favoritmu dengan mudah dan cepat.",
  keywords: ["Bligus Coffee", "kopi", "cafe", "pesan kopi", "coffee shop", "Americano", "Matcha Latte", "Croissant"],
  authors: [{ name: "Bligus Coffee" }],
  openGraph: {
    title: "Bligus Coffee — Kopi dulu, dunia nanti.",
    description: "Pilih menu favoritmu sesuai stok yang tersedia dan pesan langsung dengan mudah.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#EEEBE7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#EEEBE7] text-[#352519] selection:bg-[#352519] selection:text-[#EEEBE7]">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
