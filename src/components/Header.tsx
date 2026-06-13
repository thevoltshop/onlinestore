import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";
import { CartCounter } from "./CartCounter";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <div className="sticky top-0 z-50">

      {/* Бегущая строка */}
      <div className="overflow-hidden bg-primary py-1.5 text-white">
        <div className="animate-marquee whitespace-nowrap text-xs font-medium">
          ⚡ Добро пожаловать в THE ARX &nbsp;•&nbsp;
          🎮 Игровая периферия &nbsp;•&nbsp;
          📱 Аксессуары для телефона &nbsp;•&nbsp;
          🚗 Товары для авто &nbsp;•&nbsp;
          🎧 Электроника и гаджеты &nbsp;•&nbsp;
          👟 Одежда и обувь &nbsp;•&nbsp;
          ⚡ Добро пожаловать в THE ARX &nbsp;•&nbsp;
          🎮 Игровая периферия &nbsp;•&nbsp;
          📱 Аксессуары для телефона &nbsp;•&nbsp;
          🚗 Товары для авто &nbsp;•&nbsp;
          🎧 Электроника и гаджеты &nbsp;•&nbsp;
          👟 Одежда и обувь
        </div>
      </div>

      {/* Шапка */}
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

          {/* Логотип */}
          <Link href="/" className="shrink-0 text-xl font-bold text-primary">
            THE ARX
          </Link>

          {/* Поиск (только десктоп) */}
          <div className="hidden md:block flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Каталог
            </Link>
            <Link href="/favorites" className="text-sm font-medium hover:text-primary">
              Избранное
            </Link>
            <CartCounter />
            <Link href="/contacts" className="text-sm font-medium hover:text-primary">
              Контакты
            </Link>
            <ThemeToggle />
          </nav>

          {/* Мобильная навигация */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <CartCounter />
            <MobileNav />
          </div>

        </div>
      </header>
    </div>
  );
}
