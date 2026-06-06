"use client";

import { useState } from "react";

export function SizeSelector({ sizes }: { sizes: string }) {
  const list = sizes.split(",").map((s) => s.trim());
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Размер:{" "}
        {selected ? (
          <span className="text-primary font-bold">{selected}</span>
        ) : (
          <span className="text-muted">не выбран</span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {list.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size === selected ? null : size)}
            className={`min-w-[44px] rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              selected === size
                ? "border-primary bg-primary text-white"
                : "border-border hover:border-primary"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
