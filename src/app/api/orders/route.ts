import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function sendTelegramNotification(order: {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string | null;
  customerEmail: string;
  address: string;
  notes?: string | null;
  total: number;
  items: { product: { name: string }; quantity: number; price: number }[];
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const itemLines = order.items
    .map((i) => `• ${i.product.name} × ${i.quantity} — ${(i.price * i.quantity).toLocaleString("ru-RU")} сум`)
    .join("\n");

  const text = [
    `🛒 Новый заказ ${order.orderNumber}`,
    ``,
    `👤 ${order.customerName}`,
    order.customerPhone ? `📱 ${order.customerPhone}` : null,
    `✉️ ${order.customerEmail}`,
    `📍 ${order.address}`,
    order.notes ? `💬 ${order.notes}` : null,
    ``,
    `🛍 Товары:`,
    itemLines,
    ``,
    `💰 Итого: ${order.total.toLocaleString("ru-RU")} сум`,
    ``,
    `⏳ Ожидает подтверждения оплаты`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup: {
          inline_keyboard: [[
            { text: "✅ Подтвердить", callback_data: `approve:${order.id}` },
            { text: "❌ Отклонить",   callback_data: `reject:${order.id}`  },
          ]],
        },
      }),
    });
  } catch {
    // Не блокируем заказ если Telegram недоступен
  }
}

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

  await sendTelegramNotification(order);

  return NextResponse.json(order, { status: 201 });
}
