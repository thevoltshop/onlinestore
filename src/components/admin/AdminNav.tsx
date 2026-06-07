import Link from "next/link";

const links = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/products", label: "Товары" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/orders", label: "Заказы" },
];

export function AdminNav({ current }: { current?: string }) {
  return (
    <>
      {/* Мобильная навигация — горизонтальная полоса сверху */}
      <div className="md:hidden border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <Link href="/admin" className="text-base font-bold text-primary">
              Админ-панель
            </Link>
            <p className="text-xs text-muted">THE ARX</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-muted hover:text-primary">
              ← На сайт
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Выйти
              </button>
            </form>
          </div>
        </div>
        {/* Горизонтальный скролл с вкладками */}
        <div className="flex overflow-x-auto scrollbar-hide border-t border-border">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                current === link.href
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Десктопный сайдбар */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col border-r border-border bg-card p-4">
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
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
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
    </>
  );
}
