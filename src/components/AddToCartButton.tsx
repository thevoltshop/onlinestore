"use client";

import { useState } from "react";

type Props = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  stock: number;
};

export function AddToCartButton({ productId, name, price, imageUrl, stock }: Props) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const raw = localStorage.getItem("cart");
    const cart = raw ? JSON.parse(raw) : { items: [] };
    const existing = cart.items.find((i: { productId: string }) => i.productId === productId);

    if (existing) {
      if (existing.quantity >= stock) return;
      existing.quantity += 1;
    } else {
      cart.items.push({ productId, name, price, imageUrl, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (stock <= 0) {
    return (
      <button disabled className="btn btn-secondary w-full opacity-50">
        Нет в наличии
      </button>
    );
  }

  return (
    <button onClick={addToCart} className="btn btn-primary w-full">
      {added ? "Добавлено ✓" : "В корзину"}
    </button>
  );
}
