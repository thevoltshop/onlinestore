"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const COLOR_MAP: Record<string, [string, string]> = {
  "Белый/Чёрный":  ["#ffffff", "#1f2937"],
  "Белый/Розовый": ["#ffffff", "#f472b6"],
  "Белый/Синий":   ["#ffffff", "#60a5fa"],
  "Белый/Жёлтый":  ["#ffffff", "#facc15"],
  "Чёрный/Оранжевый": ["#1f2937", "#f97316"],
};

// Формат colors: "Название|url,Название|url"
function parseVariants(colors: string) {
  return colors.split(",").map((part) => {
    const [name, imageUrl = ""] = part.trim().split("|");
    return { name: name.trim(), imageUrl: imageUrl.trim() || null };
  });
}

type Props = {
  colors: string;
  defaultImage: string | null;
  productId: string;
  name: string;
  price: number;
  stock: number;
};

export function ProductColorViewer({
  colors, defaultImage, productId, name, price, stock,
}: Props) {
  const variants = parseVariants(colors);
  const [selected, setSelected] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(defaultImage);

  function select(variantName: string, imageUrl: string | null) {
    setSelected(variantName);
    if (imageUrl) setCurrentImage(imageUrl);
  }

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
        imageUrl: currentImage,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  return (
    <>
      {/* Изображение — меняется при выборе цвета */}
      <div className="card relative aspect-square overflow-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">Нет фото</div>
        )}
      </div>

      {/* Селектор цвета */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted">
          Цвет:{" "}
          {selected
            ? <span className="font-bold text-foreground">{selected}</span>
            : <span className="italic text-muted">не выбран</span>}
        </p>

        <div className="flex flex-wrap gap-2">
          {variants.map(({ name: vName, imageUrl }) => {
            const [main, accent] = COLOR_MAP[vName] ?? ["#e5e7eb", "#6b7280"];
            const isSelected = selected === vName;
            return (
              <button
                key={vName}
                onClick={() => select(vName, imageUrl)}
                title={vName}
                className={`flex h-10 items-center gap-2 rounded-full border-2 px-3 text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? "border-primary shadow-md scale-105"
                    : "border-border hover:border-primary/60"
                }`}
              >
                <span className="flex gap-1">
                  <span className="h-4 w-4 rounded-full border border-gray-200 shadow-sm" style={{ background: main }} />
                  <span className="h-4 w-4 rounded-full border border-gray-200 shadow-sm" style={{ background: accent }} />
                </span>
                {vName}
              </button>
            );
          })}
        </div>

        <button
          onClick={addToCart}
          disabled={!selected || stock === 0}
          className={`btn w-full transition-all ${
            selected && stock > 0
              ? "btn-primary"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          {stock === 0 ? "Нет в наличии" : selected ? "Добавить в корзину" : "Выберите цвет"}
        </button>
      </div>
    </>
  );
}
