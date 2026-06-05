import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
    },
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Каталог товаров</h1>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/products"
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              !category ? "bg-primary text-white" : "border border-border bg-card hover:border-primary"
            }`}
          >
            Все
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                category === cat.slug
                  ? "bg-primary text-white"
                  : "border border-border bg-card hover:border-primary"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <p className="text-muted">В этой категории пока нет товаров.</p>
        )}
      </main>
    </div>
  );
}
