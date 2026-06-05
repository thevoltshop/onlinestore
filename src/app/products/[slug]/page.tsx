import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { AddToCartButton } from "@/components/AddToCartButton";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/auth";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Link href="/products" className="text-sm text-muted hover:text-primary">
          ← Назад в каталог
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
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

          <div>
            {product.category && (
              <span className="text-sm font-medium uppercase tracking-wide text-muted">
                {product.category.name}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
            <p className="mt-2 text-sm text-muted">
              {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
            </p>
            <p className="mt-6 leading-relaxed text-gray-700">{product.description}</p>
            <div className="mt-8">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                stock={product.stock}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
