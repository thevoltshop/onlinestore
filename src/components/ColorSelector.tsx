"use client";

import { useState } from "react";

// карта цветов: название → [основной, акцент]
const COLOR_MAP: Record<string, [string, string]> = {
  "Белый/Чёрный":  ["#ffffff", "#1f2937"],
  "Белый/Красный": ["#ffffff", "#ef4444"],
  "Белый/Розовый": ["#ffffff", "#f472b6"],
  "Белый/Синий":   ["#ffffff", "#60a5fa"],
  "Белый/Жёлтый":  ["#ffffff", "#facc15"],
  "Чёрный/Красный":["#1f2937", "#ef4444"],
  "Синий/Розовый": ["#93c5fd", "#f9a8d4"],
};

type Props = {
  colors: string;        // "Белый/Чёрный,Белый/Розовый"
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
};

export function ColorSelector({ colors, productId, name, price, imageUrl, stock }: Props) {
  const list = colors.split(",").map((c) => c.trim()).filter(Boolean);
  const [selected, setSelected] = useState<string | null>(null);

  function addToCart() {
    if (!selected) return;
    const cartKey = `${productId}-${selected}`;
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : { items: [] };
    const existing = cart.items.find((i: { id: string }) => i.id === cartKey);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        id: cartKey,
        productId,
        name: `${name} (${selected})`,
        price,
        imageUrl,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <div className="space-y-4">
      {/* Метка */}
      <div>
        <p className="text-sm font-medium text-muted">
          Цвет:{" "}
          {selected ? (
            <span className="font-bold text-foreground">{selected}</span>
          ) : (
            <span className="text-muted">не выбран</span>
          )}
        </p>
      </div>

      {/* Свотчи */}
      <div className="flex flex-wrap gap-2">
        {list.map((color) => {
          const [main, accent] = COLOR_MAP[color] ?? ["#e5e7eb", "#6b7280"];
          const isSelected = selected === color;
          return (
            <button
              key={color}
              onClick={() => setSelected(color)}
              title={color}
              className={`flex h-9 items-center gap-1.5 rounded-full border-2 px-3 text-xs font-semibold transition-all ${
                isSelected
                  ? "border-primary shadow-md scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {/* два цветных кружка */}
              <span
                className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                style={{ background: main }}
              />
              <span
                className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                style={{ background: accent }}
              />
              <span className="ml-0.5">{color}</span>
            </button>
          );
        })}
      </div>

      {/* Кнопка в корзину */}
      <button
        onClick={addToCart}
        disabled={!selected || stock === 0}
        className={`btn w-full transition-all ${
          selected && stock > 0
            ? "btn-primary"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
      >
        {stock === 0
          ? "Нет в наличии"
          : selected
          ? "Добавить в корзину"
          : "Выберите цвет"}
      </button>
    </div>
  );
}
