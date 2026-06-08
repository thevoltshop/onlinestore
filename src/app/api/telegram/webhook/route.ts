import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

async function tg(method: string, body: object) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // Нажатие кнопки (подтвердить/отклонить)
    if (update.callback_query) {
      const { id, data, message, from } = update.callback_query;
      const [action, orderId] = (data as string).split(":");

      await tg("answerCallbackQuery", { callback_query_id: id });

      const status = action === "approve" ? "confirmed" : "cancelled";
      const label  = action === "approve" ? "✅ Подтверждён" : "❌ Отклонён";

      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status },
      });

      // Редактируем сообщение у админа
      await tg("editMessageText", {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: message.text + `\n\n${label} (${from.first_name})`,
      });

      // Уведомляем клиента если он писал в бот
      if (order.telegramChatId) {
        const clientText = action === "approve"
          ? `✅ Ваш заказ ${order.orderNumber} подтверждён!\n\nОплата получена, мы готовим заказ к отправке. Спасибо!`
          : `❌ Ваш заказ ${order.orderNumber} отклонён.\n\nЕсли вы уже оплатили, пожалуйста свяжитесь с нами.`;

        await tg("sendMessage", {
          chat_id: order.telegramChatId,
          text: clientText,
        });
      }

      return NextResponse.json({ ok: true });
    }

    // Сообщение от клиента → пересылаем админу
    if (update.message) {
      const msg = update.message;
      const clientChatId = msg.chat.id.toString();

      if (clientChatId === ADMIN_CHAT_ID) return NextResponse.json({ ok: true });

      const username = msg.from?.username
        ? `@${msg.from.username}`
        : msg.from?.first_name || "Клиент";

      // Если клиент написал номер заказа — сохраняем его chat ID
      const text: string = msg.text || msg.caption || "";
      const orderMatch = text.match(/ORD-[A-Z0-9]+/i);
      if (orderMatch) {
        const orderNumber = orderMatch[0].toUpperCase();
        await prisma.order.updateMany({
          where: { orderNumber },
          data: { telegramChatId: clientChatId },
        });
      }

      if (msg.photo) {
        const photoId = msg.photo[msg.photo.length - 1].file_id;
        const caption = msg.caption ? `\n${msg.caption}` : "";
        await tg("sendPhoto", {
          chat_id: ADMIN_CHAT_ID,
          photo: photoId,
          caption: `📩 Чек от ${username}${caption}`,
        });
        await tg("sendMessage", {
          chat_id: clientChatId,
          text: "✅ Чек получен! Мы проверим оплату и подтвердим ваш заказ в ближайшее время.",
        });
      } else if (msg.text) {
        await tg("sendMessage", {
          chat_id: ADMIN_CHAT_ID,
          text: `📩 Сообщение от ${username}:\n${msg.text}`,
        });
        await tg("sendMessage", {
          chat_id: clientChatId,
          text: `Здравствуйте! 👋\nОтправьте фото/скриншот чека оплаты и укажите номер вашего заказа (например: ORD-XXXXXX).`,
        });
      }
    }
  } catch (e) {
    console.error("Telegram webhook error:", e);
  }

  return NextResponse.json({ ok: true });
}
