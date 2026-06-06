import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  if (!ids.length) return NextResponse.json([]);

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: { category: true },
  });

  return NextResponse.json(products);
}
