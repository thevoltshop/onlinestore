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

      await prisma.order.update({ where: { id: orderId }, data: { status } });

      await tg("editMessageText", {
        chat_id: message.chat.id,
        message_id: message.message_id,
        text: message.text + `\n\n${label} (${from.first_name})`,
      });

      return NextResponse.json({ ok: true });
    }

    // Сообщение от клиента → пересылаем админу
    if (update.message) {
      const msg = update.message;
      const clientChatId = msg.chat.id.toString();

      // Сообщения от самого себя (админа) игнорируем
      if (clientChatId === ADMIN_CHAT_ID) return NextResponse.json({ ok: true });

      const username = msg.from?.username
        ? `@${msg.from.username}`
        : msg.from?.first_name || "Клиент";

      if (msg.photo) {
        // Клиент прислал фото чека
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
        // Клиент написал текст
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
