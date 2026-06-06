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
      {/* Размеры */}
      <div>
        <p className="mb-2 text-sm font-medium">
          Размер:{" "}
          {selected
            ? <span className="font-bold text-primary">{selected}</span>
            : <span className="text-muted">выберите размер</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {list.map((size) => (
            <button
              key={size}
              onClick={() => setSelected(size === selected ? null : size)}
              className={`min-w-[44px] rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                selected === size
                  ? "border-primary bg-primary text-white"
                  : "border-border hover:border-primary"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Кнопка корзины */}
      {stock <= 0 ? (
        <button disabled className="btn btn-secondary w-full opacity-50">
          Нет в наличии
        </button>
      ) : (
        <button
          onClick={addToCart}
          disabled={!selected}
          className={`btn btn-primary w-full transition ${!selected ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {added ? "Добавлено ✓" : selected ? `В корзину — размер ${selected}` : "Выберите размер"}
        </button>
      )}
    </div>
  );
}
