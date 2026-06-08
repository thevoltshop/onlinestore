import Link from "next/link";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold md:text-5xl">Добро пожаловать в THE ARX</h1>
            <p className="mt-4 max-w-xl text-lg text-blue-100">
              Электроника, гаджеты, аксессуары и одежда с быстрой доставкой по Узбекистану.
            </p>
            <Link href="/products" className="btn mt-6 bg-white text-primary hover:bg-blue-50">
              Смотреть каталог
            </Link>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary"
              >
                Все
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-2xl font-bold">Популярные товары</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imageUrl={product.imageUrl}
                categoryName={product.category?.name}
              />
            ))}
          </div>
          {products.length === 0 && (
            <p className="text-muted">Товары пока не добавлены. Зайдите в админ-панель.</p>
          )}
        </section>
      </main>
      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted">
        © 2026 THE ARX. Управление через{" "}
        <Link href="/admin" className="text-primary hover:underline">
          админ-панель
        </Link>
      </footer>
    </div>
  );
}
