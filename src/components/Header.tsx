import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          OnlineStore
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Каталог
          </Link>
          <Link href="/cart" className="text-sm font-medium hover:text-primary">
            Корзина
          </Link>
          <Link
            href="/admin"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Админка
          </Link>
        </nav>
      </div>
    </header>
  );
}
