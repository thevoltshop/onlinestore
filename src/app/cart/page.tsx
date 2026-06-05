"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import type { Cart, CartItem } from "@/lib/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setCart(JSON.parse(raw));
    setMounted(true);
  }, []);

  function saveCart(items: CartItem[]) {
    const newCart = { items };
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  }

  function updateQuantity(productId: string, delta: number) {
    const items = cart.items.map((item) => {
      if (item.productId !== productId) return item;
      return { ...item, quantity: Math.max(1, item.quantity + delta) };
    });
    saveCart(items);
  }

  function removeItem(productId: string) {
    saveCart(cart.items.filter((i) => i.productId !== productId));
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (!mounted) return null;

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Корзина</h1>

        {cart.items.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-muted">Корзина пуста</p>
            <Link href="/products" className="btn btn-primary mt-4">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="card flex items-center gap-4 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, -1)}
                    className="btn btn-secondary h-8 w-8 p-0"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, 1)}
                    className="btn btn-secondary h-8 w-8 p-0"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </div>
            ))}

            <div className="card flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted">Итого</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
              </div>
              <Link href="/checkout" className="btn btn-primary">
                Оформить заказ
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
