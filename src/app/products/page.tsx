import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = { searchParams: Promise<{ category?: string; q?: string; sort?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { category, q, sort } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy:
      sort === "price_asc"  ? { price: "asc" }  :
      sort === "price_desc" ? { price: "desc" } :
      sort === "newest"     ? { createdAt: "desc" } :
                              { name: "asc" },
  });

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Каталог товаров</h1>

        {/* Категории */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link href={q ? `/products?q=${q}` : "/products"}
            className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-primary text-white" : "border border-border bg-card hover:border-primary"}`}>
            Все
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id}
              href={`/products?category=${cat.slug}${q ? `&q=${q}` : ""}`}
              className={`rounded-full px-4 py-2 text-sm font-medium ${category === cat.slug ? "bg-primary text-white" : "border border-border bg-card hover:border-primary"}`}>
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Сортировка */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted">Сортировка:</span>
          {[
            { value: "", label: "По названию" },
            { value: "price_asc", label: "Дешевле" },
            { value: "price_desc", label: "Дороже" },
            { value: "newest", label: "Новинки" },
          ].map((opt) => (
            <Link key={opt.value}
              href={`/products?${category ? `category=${category}&` : ""}${q ? `q=${q}&` : ""}${opt.value ? `sort=${opt.value}` : ""}`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${sort === opt.value || (!sort && opt.value === "") ? "border-primary bg-primary text-white" : "border-border hover:border-primary"}`}>
              {opt.label}
            </Link>
          ))}

          {q && (
            <span className="ml-auto text-sm text-muted">
              Поиск: <span className="font-semibold text-foreground">«{q}»</span>{" "}
              <Link href={`/products${category ? `?category=${category}` : ""}`} className="text-primary hover:underline">✕</Link>
            </span>
          )}
        </div>

        {/* Товары */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const avg = product.reviews.length
              ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
              : null;
            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imageUrl={product.imageUrl}
                categoryName={product.category?.name}
                avgRating={avg}
                reviewCount={product.reviews.length}
                description={product.description ?? ""}
                stock={product.stock}
              />
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="mt-8 text-center text-muted">
            {q ? `По запросу «${q}» ничего не найдено.` : "В этой категории пока нет товаров."}
          </p>
        )}
      </main>
    </div>
  );
}
