"use client";

import { useEffect, useState } from "react";

export function FavoriteButton({ productId }: { productId: string }) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs: string[] = JSON.parse(localStorage.getItem("favorites") ?? "[]");
    setIsFav(favs.includes(productId));
  }, [productId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const favs: string[] = JSON.parse(localStorage.getItem("favorites") ?? "[]");
    const idx = favs.indexOf(productId);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(productId);
    localStorage.setItem("favorites", JSON.stringify(favs));
    setIsFav(idx < 0);
    window.dispatchEvent(new Event("favoritesUpdated"));
  }

  return (
    <button
      onClick={toggle}
      aria-label="В избранное"
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110"
    >
      <span className={isFav ? "text-red-500" : "text-gray-300"} style={{ fontSize: 18 }}>
        ♥
      </span>
    </button>
  );
}
