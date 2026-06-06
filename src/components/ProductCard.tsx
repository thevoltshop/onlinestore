import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";
import { QuickView } from "./QuickView";

type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  categoryName?: string | null;
  avgRating?: number | null;
  reviewCount?: number;
  description?: string;
  stock?: number;
};

export function ProductCard({
  id,
  name,
  slug,
  price,
  imageUrl,
  categoryName,
  avgRating,
  reviewCount,
  description = "",
  stock = 0,
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="card group relative overflow-hidden transition hover:shadow-md">
      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">Нет фото</div>
        )}

        <FavoriteButton productId={id} />
        <QuickView id={id} name={name} slug={slug} price={price}
          imageUrl={imageUrl} stock={stock} description={description} />
      </div>

      <div className="p-4">
        {categoryName && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            {categoryName}
          </span>
        )}
        <h3 className="mt-1 font-semibold group-hover:text-primary">{name}</h3>
        <p className="mt-2 text-lg font-bold text-primary">{formatPrice(price)}</p>

        {avgRating != null && (
          <div className="mt-1.5 flex items-center gap-1">
            <span className="text-sm text-yellow-400">
              {"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-xs text-muted">{reviewCount}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
