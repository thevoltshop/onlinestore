"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";

type Product = {
  id: string; name: string; slug: string; price: number;
  imageUrl: string | null; category: { name: string } | null;
};

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const ids: string[] = JSON.parse(localStorage.getItem("favorites") ?? "[]");
      if (!ids.length) { setLoading(false); return; }
      const res = await fetch(`/api/favorites?ids=${ids.join(",")}`);
      if (res.ok) setProducts(await res.json());
      setLoading(false);
    }
    load();
    window.addEventListener("favoritesUpdated", load);
    return () => window.removeEventListener("favoritesUpdated", load);
  }, []);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Избранное</h1>

        {loading && <p className="text-muted">Загрузка...</p>}

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🤍</p>
            <p className="text-muted mb-4">В избранном пока ничего нет</p>
            <Link href="/products" className="btn btn-primary">Перейти в каталог</Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
              price={p.price} imageUrl={p.imageUrl} categoryName={p.category?.name} />
          ))}
        </div>
      </main>
    </div>
  );
}
