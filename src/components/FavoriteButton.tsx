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
      className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
    >
      <span
        className="transition-colors duration-200"
        style={{
          fontSize: 18,
          color: isFav ? "#ef4444" : "#9ca3af",
          filter: isFav ? "drop-shadow(0 0 4px rgba(239,68,68,0.5))" : "none",
        }}
      >
        {isFav ? "♥" : "♡"}
      </span>
    </button>
  );
}
