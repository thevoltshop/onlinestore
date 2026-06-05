import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, customerEmail, customerPhone, address, notes, items } = body;

  if (!customerName || !customerEmail || !address || !items?.length) {
    return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
  }

  let total = 0;
  const orderItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || !product.isActive || product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Товар "${product?.name || item.productId}" недоступен` },
        { status: 400 }
      );
    }
    total += product.price * item.quantity;
    orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
  }

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        address,
        notes: notes || null,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
