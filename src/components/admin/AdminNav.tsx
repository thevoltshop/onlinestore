import Link from "next/link";

const links = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/orders", label: "Заказы" },
];

export function AdminNav({ current }: { current?: string }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card p-4">
      <div className="mb-6">
        <Link href="/admin" className="text-lg font-bold text-primary">
          Админ-панель
        </Link>
        <p className="text-xs text-muted">THE ARX</p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium ${
              current === link.href
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 space-y-2 border-t border-border pt-4">
        <Link href="/" className="block text-sm text-muted hover:text-primary">
          ← На сайт
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
