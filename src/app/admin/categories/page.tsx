"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const url = editing ? `/api/categories/${editing.id}` : "/api/categories";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", description: "" });
    setEditing(null);
    setLoading(false);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Удалить категорию «${name}»?`)) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Категории</h1>

      <form onSubmit={handleSubmit} className="card mt-6 max-w-lg space-y-4 p-5">
        <h2 className="font-semibold">{editing ? "Редактировать" : "Новая категория"}</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Название</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Описание</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {editing ? "Сохранить" : "Создать"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ name: "", description: "" });
              }}
              className="btn btn-secondary"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-muted">
                {cat.slug} · {cat._count.products} товар(ов)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditing(cat);
                  setForm({ name: cat.name, description: cat.description || "" });
                }}
                className="text-sm text-primary hover:underline"
              >
                Изменить
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.name)}
                className="text-sm text-red-600 hover:underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
