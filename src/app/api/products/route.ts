import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: PRODUCTS,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat produk" },
      { status: 500 }
    );
  }
}
