"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { Cart } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(price) + " сум";
}

function buildPaymeUrl(orderId: string, totalSum: number): string {
  const merchantId = process.env.NEXT_PUBLIC_PAYME_MERCHANT_ID ?? "";
  const tiyin = Math.round(totalSum * 100);
  const raw = `m=${merchantId};ac.order_id=${orderId};a=${tiyin}`;
  return `https://checkout.paycom.uz/${btoa(raw)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{ id: string; orderNumber: string; total: number } | null>(null);

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

  // Заказ оформлен — выбор способа оплаты
  if (order) {
    const paymeUrl = buildPaymeUrl(order.id, order.total);
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-lg px-4 py-16">
          <div className="card space-y-5 p-8 text-center">
            <div className="text-5xl">✓</div>
            <h2 className="text-xl font-bold">Заказ {order.orderNumber} оформлен!</h2>
            <p className="text-muted">Сумма: {formatPrice(order.total)}</p>
            <p className="text-sm text-muted">Выберите способ оплаты</p>

            <div className="space-y-3 pt-2">
              <a
                href={paymeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary flex w-full items-center justify-center gap-2"
              >
                <span>Оплатить через Payme</span>
              </a>

              <button
                onClick={() => router.push("/")}
                className="btn w-full border border-border hover:border-primary"
              >
                Оплачу при получении
              </button>
            </div>
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
