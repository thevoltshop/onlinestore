"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/auth";

type Props = {
  id: string; name: string; slug: string; price: number;
  imageUrl?: string | null; stock: number; description: string;
};

export function QuickView(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white/90 px-3 py-1 text-xs font-semibold shadow opacity-0 group-hover:opacity-100 transition-opacity"
      >
        👁 Быстрый просмотр
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card relative w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-card text-lg shadow"
            >✕</button>

            <div className="grid sm:grid-cols-2">
              <div className="relative aspect-square bg-gray-100">
                {props.imageUrl ? (
                  <Image src={props.imageUrl} alt={props.name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">Нет фото</div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <h3 className="font-bold text-lg leading-tight">{props.name}</h3>
                <p className="text-2xl font-bold text-primary">{formatPrice(props.price)}</p>
                <p className="text-sm text-muted line-clamp-4">{props.description}</p>
                <AddToCartButton productId={props.id} name={props.name}
                  price={props.price} imageUrl={props.imageUrl} stock={props.stock} />
                <Link href={`/products/${props.slug}`}
                  className="block text-center text-sm text-primary hover:underline"
                  onClick={() => setOpen(false)}>
                  Открыть страницу товара →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
