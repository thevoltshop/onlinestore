"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ authorName: "", rating: 5, text: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Ошибка");
      setLoading(false);
      return;
    }

    setDone(true);
    router.refresh();
  }

  if (done) {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
        ✓ Спасибо за отзыв!
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <h3 className="font-semibold">Оставить отзыв</h3>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <label className="mb-1 block text-sm font-medium">Ваше имя *</label>
        <input
          required
          value={form.authorName}
          onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          placeholder="Например: Амир"
        />
      </div>

      {/* Звёздочки */}
      <div>
        <label className="mb-1 block text-sm font-medium">Оценка *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm({ ...form, rating: star })}
              className={`text-2xl transition ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Комментарий *</label>
        <textarea
          required
          rows={3}
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="Расскажите о товаре..."
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? "Отправка..." : "Опубликовать отзыв"}
      </button>
    </form>
  );
}
