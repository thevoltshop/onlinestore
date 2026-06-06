import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Payme transaction states
const STATE_CREATED = 1;
const STATE_COMPLETED = 2;
const STATE_CANCELLED = -1;

// Payme error objects
const ERR = {
  UNAUTHORIZED:    { code: -32504, message: "Ошибка авторизации" },
  METHOD_UNKNOWN:  { code: -32601, message: "Метод не найден" },
  INVALID_AMOUNT:  { code: -31001, message: "Неверная сумма" },
  ORDER_NOT_FOUND: { code: -31050, message: "Заказ не найден" },
  TX_NOT_FOUND:    { code: -31003, message: "Транзакция не найдена" },
  CANNOT_PERFORM:  { code: -31008, message: "Нельзя выполнить операцию" },
  CANNOT_CANCEL:   { code: -31007, message: "Нельзя отменить транзакцию" },
};

function ok(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function err(id: unknown, e: { code: number; message: string }) {
  return NextResponse.json({ jsonrpc: "2.0", id, error: { code: e.code, message: { ru: e.message } } });
}

function checkAuth(request: Request): boolean {
  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Basic ")) return false;
  const decoded = Buffer.from(auth.slice(6), "base64").toString();
  return decoded === `Paycom:${process.env.PAYME_KEY}`;
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return err(null, ERR.UNAUTHORIZED);
  }

  const body = await request.json();
  const { method, params, id } = body;

  switch (method) {
    case "CheckPerformTransaction": return checkPerform(id, params);
    case "CreateTransaction":       return createTx(id, params);
    case "PerformTransaction":      return performTx(id, params);
    case "CancelTransaction":       return cancelTx(id, params);
    case "CheckTransaction":        return checkTx(id, params);
    case "GetStatement":            return getStatement(id, params);
    default: return err(id, ERR.METHOD_UNKNOWN);
  }
}

// ─── Handlers ───────────────────────────────────────────────────────────────

async function checkPerform(id: unknown, params: { amount: number; account: { order_id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.account.order_id } });
  if (!order) return err(id, ERR.ORDER_NOT_FOUND);
  if (order.paymentStatus === "paid") return err(id, ERR.CANNOT_PERFORM);

  const expected = Math.round(order.total * 100); // сум → тийин
  if (params.amount !== expected) return err(id, ERR.INVALID_AMOUNT);

  return ok(id, { allow: true });
}

async function createTx(id: unknown, params: { id: string; time: number; amount: number; account: { order_id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.account.order_id } });
  if (!order) return err(id, ERR.ORDER_NOT_FOUND);
  if (order.paymentStatus === "paid") return err(id, ERR.CANNOT_PERFORM);

  const expected = Math.round(order.total * 100);
  if (params.amount !== expected) return err(id, ERR.INVALID_AMOUNT);

  // Если транзакция уже существует — вернуть её
  const existing = await prisma.paymeTransaction.findUnique({ where: { transactionId: params.id } });
  if (existing) {
    if (existing.state !== STATE_CREATED) return err(id, ERR.CANNOT_PERFORM);
    return ok(id, { create_time: existing.createdAt.getTime(), transaction: existing.id, state: existing.state });
  }

  const tx = await prisma.paymeTransaction.create({
    data: { transactionId: params.id, orderId: order.id, state: STATE_CREATED, amount: params.amount },
  });

  return ok(id, { create_time: tx.createdAt.getTime(), transaction: tx.id, state: tx.state });
}

async function performTx(id: unknown, params: { id: string }) {
  const tx = await prisma.paymeTransaction.findUnique({ where: { transactionId: params.id } });
  if (!tx) return err(id, ERR.TX_NOT_FOUND);

  if (tx.state === STATE_COMPLETED) {
    return ok(id, { transaction: tx.id, perform_time: tx.performedAt!.getTime(), state: tx.state });
  }
  if (tx.state !== STATE_CREATED) return err(id, ERR.CANNOT_PERFORM);

  const now = new Date();
  const updated = await prisma.paymeTransaction.update({
    where: { id: tx.id },
    data: { state: STATE_COMPLETED, performedAt: now },
  });

  await prisma.order.update({
    where: { id: tx.orderId },
    data: { paymentStatus: "paid", status: "confirmed" },
  });

  await notifyPayment(tx.orderId);

  return ok(id, { transaction: updated.id, perform_time: now.getTime(), state: STATE_COMPLETED });
}

async function cancelTx(id: unknown, params: { id: string; reason: number }) {
  const tx = await prisma.paymeTransaction.findUnique({ where: { transactionId: params.id } });
  if (!tx) return err(id, ERR.TX_NOT_FOUND);

  if (tx.state === STATE_CANCELLED) {
    return ok(id, { transaction: tx.id, cancel_time: tx.cancelledAt!.getTime(), state: tx.state });
  }
  if (tx.state === STATE_COMPLETED) return err(id, ERR.CANNOT_CANCEL);

  const now = new Date();
  const updated = await prisma.paymeTransaction.update({
    where: { id: tx.id },
    data: { state: STATE_CANCELLED, cancelledAt: now, reason: params.reason },
  });

  await prisma.order.update({
    where: { id: tx.orderId },
    data: { paymentStatus: "unpaid" },
  });

  return ok(id, { transaction: updated.id, cancel_time: now.getTime(), state: STATE_CANCELLED });
}

async function checkTx(id: unknown, params: { id: string }) {
  const tx = await prisma.paymeTransaction.findUnique({ where: { transactionId: params.id } });
  if (!tx) return err(id, ERR.TX_NOT_FOUND);

  return ok(id, {
    create_time: tx.createdAt.getTime(),
    perform_time: tx.performedAt?.getTime() ?? 0,
    cancel_time: tx.cancelledAt?.getTime() ?? 0,
    transaction: tx.id,
    state: tx.state,
    reason: tx.reason ?? null,
  });
}

async function getStatement(id: unknown, params: { from: number; to: number }) {
  const txs = await prisma.paymeTransaction.findMany({
    where: { createdAt: { gte: new Date(params.from), lte: new Date(params.to) } },
  });

  return ok(id, {
    transactions: txs.map((tx) => ({
      id: tx.transactionId,
      time: tx.createdAt.getTime(),
      amount: tx.amount,
      account: { order_id: tx.orderId },
      create_time: tx.createdAt.getTime(),
      perform_time: tx.performedAt?.getTime() ?? 0,
      cancel_time: tx.cancelledAt?.getTime() ?? 0,
      transaction: tx.id,
      state: tx.state,
      reason: tx.reason ?? null,
    })),
  });
}

// ─── Telegram при оплате ─────────────────────────────────────────────────────

async function notifyPayment(orderId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const text = [
    `✅ ОПЛАТА ПОЛУЧЕНА`,
    ``,
    `Заказ ${order.orderNumber}`,
    `👤 ${order.customerName}`,
    order.customerPhone ? `📱 ${order.customerPhone}` : null,
    `💰 ${order.total.toLocaleString("ru-RU")} сум`,
  ].filter(Boolean).join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    // не блокируем
  }
}
