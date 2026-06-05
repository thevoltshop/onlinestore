import { NextResponse } from "next/server";
import { createSession, verifyAdmin } from "@/lib/auth";

// Хранилище попыток входа (сбрасывается при перезапуске сервера)
const attempts = new Map<string, { count: number; blockedUntil: number }>();

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 минут

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();

  // Проверка блокировки IP
  const record = attempts.get(ip);
  if (record && record.blockedUntil > now) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return NextResponse.json(
      { error: `Слишком много попыток. Повторите через ${minutesLeft} мин.` },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  }

  const admin = await verifyAdmin(email, password);

  if (!admin) {
    // Увеличиваем счётчик неудачных попыток
    const current = attempts.get(ip) || { count: 0, blockedUntil: 0 };
    current.count += 1;

    if (current.count >= MAX_ATTEMPTS) {
      current.blockedUntil = now + BLOCK_DURATION;
      current.count = 0;
    }

    attempts.set(ip, current);

    const remaining = MAX_ATTEMPTS - current.count;
    return NextResponse.json(
      { error: `Неверный email или пароль. Осталось попыток: ${remaining}` },
      { status: 401 }
    );
  }

  // Успешный вход — сбрасываем счётчик
  attempts.delete(ip);
  await createSession(admin);
  return NextResponse.json({ success: true });
}
