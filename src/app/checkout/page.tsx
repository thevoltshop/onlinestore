"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { Cart } from "@/lib/types";

const CARD_NUMBER = "9860190115631094";
const CARD_DISPLAY = "9860 1901 1563 1094";
const CARD_HOLDER = "Динара Ахмедова";
const BOT_USERNAME = "@TheVolt_bot";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(price) + " сум";
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ id: string; orderNumber: string; total: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setCart(JSON.parse(raw));
  }, []);

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка оформления заказа");
      setLoading(false);
      return;
    }

    localStorage.removeItem("cart");
    setOrder({ id: data.id, orderNumber: data.orderNumber, total: data.total });
  }

  // Корзина пуста и заказ ещё не оформлен
  if (cart.items.length === 0 && !order) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-muted">Корзина пуста</p>
          <Link href="/products" className="btn btn-primary mt-4">
            В каталог
          </Link>
        </main>
      </div>
    );
  }

  function copyCard() {
    navigator.clipboard.writeText(CARD_NUMBER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Заказ оформлен — показываем реквизиты для оплаты
  if (order) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-lg px-4 py-16">
          <div className="card space-y-6 p-8">
            <div className="text-center">
              <div className="mb-2 text-5xl">✅</div>
              <h2 className="text-xl font-bold">Заказ {order.orderNumber} оформлен!</h2>
              <p className="mt-1 text-muted">Сумма к оплате: <span className="font-bold text-primary">{formatPrice(order.total)}</span></p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <p className="text-sm font-semibold text-muted uppercase tracking-wide">Реквизиты для оплаты</p>

              <div className="space-y-1">
                <p className="text-xs text-muted">Банк</p>
                <p className="font-medium">UzCard</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted">Номер карты</p>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold tracking-widest">{CARD_DISPLAY}</span>
                  <button
                    onClick={copyCard}
                    className="rounded-lg border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                  >
                    {copied ? "Скопировано!" : "Копировать"}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted">Получатель</p>
                <p className="font-medium">{CARD_HOLDER}</p>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 text-sm space-y-2">
              <p className="font-semibold text-blue-800">Как подтвердить оплату:</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Переведите сумму на карту выше</li>
                <li>Сделайте скриншот чека</li>
                <li>Откройте Telegram: <span className="font-bold">{BOT_USERNAME}</span></li>
                <li>Отправьте фото чека с подписью: <span className="font-bold select-all">{order.orderNumber}</span></li>
              </ol>
            </div>

            <p className="text-center text-xs text-muted">
              После получения чека мы подтвердим заказ и свяжемся с вами.
            </p>

            <button
              onClick={() => router.push("/")}
              className="btn w-full border border-border hover:border-primary"
            >
              На главную
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Форма оформления
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Оформление заказа</h1>

        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          <div>
            <label className="mb-1 block text-sm font-medium">Имя *</label>
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input
              type="email"
              required
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Телефон</label>
            <input
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Адрес доставки *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Комментарий</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted">
              {cart.items.length} товар(ов) на сумму{" "}
              <span className="font-bold text-primary">{formatPrice(total)}</span>
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Оформление..." : "Подтвердить заказ"}
          </button>
        </form>
      </main>
    </div>
  );
}
