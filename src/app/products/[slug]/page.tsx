import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { AddToCartButton } from "@/components/AddToCartButton";
import { SizeSelector } from "@/components/SizeSelector";
import { ColorSelector } from "@/components/ColorSelector";
import { ReviewForm } from "@/components/ReviewForm";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/auth";
import { ProductCard } from "@/components/ProductCard";

type Props = { params: Promise<{ slug: string }> };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s}>{s <= Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  const similar = product.categoryId
    ? await prisma.product.findMany({
        where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
        include: { category: true, reviews: { select: { rating: true } } },
        take: 4,
      })
    : [];

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/products" className="text-sm text-muted hover:text-primary">
          ← Назад в каталог
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {/* Фото */}
          <div className="card relative aspect-square overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted">Нет фото</div>
            )}
          </div>

          {/* Инфо */}
          <div className="space-y-4">
            {product.category && (
              <span className="text-sm font-medium uppercase tracking-wide text-muted">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Рейтинг */}
            {avgRating !== null && (
              <div className="flex items-center gap-2">
                <Stars rating={avgRating} />
                <span className="text-sm text-muted">
                  {avgRating.toFixed(1)} ({product.reviews.length} отз.)
                </span>
              </div>
            )}

            <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="text-sm text-muted">
              {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
            </p>
            <p className="leading-relaxed">{product.description}</p>

            <div className="border-t border-border pt-4">
              {product.colors ? (
                <ColorSelector
                  colors={product.colors}
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                />
              ) : product.sizes ? (
                <SizeSelector
                  sizes={product.sizes}
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                />
              ) : (
                <AddToCartButton
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  stock={product.stock}
                />
              )}
            </div>
          </div>
        </div>

        {/* Похожие товары */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Похожие товары</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p) => {
                const avg = p.reviews.length
                  ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
                  : null;
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    price={p.price}
                    imageUrl={p.imageUrl}
                    categoryName={p.category?.name}
                    avgRating={avg}
                    reviewCount={p.reviews.length}
                    description={p.description ?? ""}
                    stock={p.stock}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Отзывы */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">
            Отзывы{" "}
            {product.reviews.length > 0 && (
              <span className="text-lg font-normal text-muted">({product.reviews.length})</span>
            )}
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Форма */}
            <ReviewForm productId={product.id} />

            {/* Список отзывов */}
            <div className="space-y-4">
              {product.reviews.length === 0 && (
                <p className="text-muted">Пока нет отзывов. Будьте первым!</p>
              )}
              {product.reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.authorName}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
                  <p className="mt-2 text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border py-8 text-center text-sm text-muted">
        © 2026 THE ARX.{" "}
        <Link href="/admin" className="text-primary hover:underline">
          Администрирование
        </Link>
      </footer>
    </div>
  );
}
