"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CartCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function update() {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : { items: [] };
      const total = cart.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0);
      setCount(total);
    }
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link href="/cart" className="relative text-sm font-medium hover:text-primary">
      Корзина
      {count > 0 && (
        <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
