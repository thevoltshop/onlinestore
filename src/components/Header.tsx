import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary">
          THE VOLT
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            Каталог
          </Link>
          <Link href="/cart" className="text-sm font-medium hover:text-primary">
            Корзина
          </Link>
          <Link href="/contacts" className="text-sm font-medium hover:text-primary">
            Контакты
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
