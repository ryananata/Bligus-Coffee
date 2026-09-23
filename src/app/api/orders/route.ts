import { NextResponse } from "next/server";
import { generateOrderId } from "@/utils/orderId";
import { Order } from "@/types";

// In-memory dummy store for demo backend simulation
const ORDERS_DB: Order[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, whatsapp, items, total, notes } = body;

    if (!customerName || !whatsapp || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Data pesanan tidak lengkap." },
        { status: 400 }
      );
    }

    const newOrder: Order = {
      id: generateOrderId(),
      customerName,
      whatsapp,
      notes: notes || undefined,
      items,
      total,
      status: "Menunggu Diproses",
      createdAt: new Date().toISOString(),
    };

    ORDERS_DB.push(newOrder);

    return NextResponse.json(
      {
        success: true,
        message: "Pesanan berhasil dibuat.",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
