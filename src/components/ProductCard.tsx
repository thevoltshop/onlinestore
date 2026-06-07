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
  description = "",
  stock = 0,
}: ProductCardProps) {
  const inStock = stock > 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Фото */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">
            📦
          </div>
        )}

        {/* Градиент снизу при наведении */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Цена поверх фото при наведении */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-3 px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-lg font-bold text-white drop-shadow">{formatPrice(price)}</p>
        </div>

        {/* Бейдж наличия — левый верхний угол */}
        <div className="absolute left-2.5 top-2.5">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold shadow ${
              inStock
                ? "bg-blue-500 text-white"
                : "bg-gray-400 text-white"
            }`}
          >
            {inStock ? "В наличии" : "Нет в наличии"}
          </span>
        </div>

        {/* Избранное — правый верхний угол */}
        <FavoriteButton productId={id} />

        {/* Быстрый просмотр */}
        <QuickView
          id={id} name={name} slug={slug} price={price}
          imageUrl={imageUrl} stock={stock} description={description}
        />
      </div>

      {/* Инфо под фото */}
      <div className="px-3 py-3">
        {categoryName && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            {categoryName}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-2 text-base font-bold text-primary">{formatPrice(price)}</p>
      </div>
    </Link>
  );
}
