"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      {/* Гамбургер */}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-border"
        aria-label="Меню"
      >
        <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 bg-current transition-all ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {/* Дропдаун */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-border bg-card p-2 shadow-lg">
          {[
            { href: "/products", label: "Каталог" },
            { href: "/favorites", label: "🤍 Избранное" },
            { href: "/cart", label: "🛒 Корзина" },
            { href: "/contacts", label: "Контакты" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-border"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
