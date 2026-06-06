"use client";

import { useState } from "react";

type Props = {
  sizes: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
};

export function SizeSelector({ sizes, productId, name, price, imageUrl, stock }: Props) {
  const list = sizes.split(",").map((s) => s.trim());
  const [selected, setSelected] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  function addToCart() {
    if (!selected) return;
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : { items: [] };

    const nameWithSize = `${name} (${selected})`;
    const key = `${productId}-${selected}`;

    const existing = cart.items.find((i: { productId: string }) => i.productId === key);
    if (existing) {
      if (existing.quantity >= stock) return;
      existing.quantity += 1;
    } else {
      cart.items.push({ productId: key, name: nameWithSize, price, imageUrl, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Лейбл */}
      <p className="text-sm font-medium text-muted">
        Размер одежды:{" "}
        {selected && <span className="font-bold text-foreground">{selected}</span>}
      </p>

      {/* Кнопки размеров */}
      <div className="flex flex-wrap gap-2">
        {list.map((size) => {
          const isSelected = selected === size;
          return (
            <button
              key={size}
              onClick={() => setSelected(size === selected ? null : size)}
              className={`flex h-11 min-w-[44px] items-center justify-center rounded-2xl border-2 px-3 text-sm font-semibold transition-all ${
                isSelected
                  ? "border-foreground bg-transparent text-foreground scale-105"
                  : "border-border hover:border-foreground/50 text-foreground"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Кнопка корзины */}
      {stock <= 0 ? (
        <button disabled className="btn w-full rounded-2xl bg-gray-300 py-4 text-gray-500 cursor-not-allowed font-semibold">
          Нет в наличии
        </button>
      ) : (
        <button
          onClick={addToCart}
          disabled={!selected}
          className={`btn w-full rounded-2xl py-4 text-base font-semibold transition-all ${
            selected
              ? "bg-primary text-white hover:bg-primary-dark"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {added
            ? "Добавлено в корзину ✓"
            : selected
            ? "В корзину"
            : "Выберите размер"}
        </button>
      )}
    </div>
  );
}
