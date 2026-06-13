import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHANNEL = "@thearxq1";
const SITE = "https://onlinestore-indol-seven.vercel.app";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(price);
}

async function tg(method: string, body: object) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(request: Request) {
  const { secret } = await request.json().catch(() => ({}));
  if (!secret || secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });

  const results = [];

  for (const product of products) {
    const caption = [
      `🛍 *${product.name}*`,
      product.category ? `📂 ${product.category.name}` : null,
      ``,
      product.description,
      ``,
      `💰 *${formatPrice(product.price)} сум*`,
      product.stock > 0 ? `✅ В наличии` : `❌ Нет в наличии`,
      ``,
      `🔗 [Смотреть на сайте](${SITE}/products/${product.slug})`,
      ``,
      `💬 [Написать менеджеру](https://t.me/thearx_manager)`,
      `📸 [Instagram](https://www.instagram.com/thearx.uz)`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    let result;
    if (product.imageUrl) {
      result = await tg("sendPhoto", {
        chat_id: CHANNEL,
        photo: product.imageUrl,
        caption,
        parse_mode: "Markdown",
      });
    } else {
      result = await tg("sendMessage", {
        chat_id: CHANNEL,
        text: caption,
        parse_mode: "Markdown",
      });
    }

    results.push({ name: product.name, ok: result.ok });

    // Пауза между постами чтобы не превысить лимит Telegram
    await sleep(1500);
  }

  return NextResponse.json({ posted: results.length, results });
}
