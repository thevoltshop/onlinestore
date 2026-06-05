import { NextResponse } from "next/server";
import { createSession, verifyAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
  }

  const admin = await verifyAdmin(email, password);
  if (!admin) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  }

  await createSession(admin);
  return NextResponse.json({ success: true });
}
