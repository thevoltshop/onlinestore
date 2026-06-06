"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) router.push(`/products?q=${encodeURIComponent(trimmed)}`);
    else router.push("/products");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 focus-within:border-primary transition">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск товаров..."
        className="w-36 border-0 bg-transparent p-0 text-sm outline-none focus:outline-none sm:w-48"
      />
      <button type="submit" className="text-muted hover:text-primary text-sm">🔍</button>
    </form>
  );
}
