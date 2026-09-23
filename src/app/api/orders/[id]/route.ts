import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    success: true,
    data: {
      id,
      status: "Menunggu Diproses",
      message: `Status pesanan ${id} berhasil diambil.`,
    },
  });
}
