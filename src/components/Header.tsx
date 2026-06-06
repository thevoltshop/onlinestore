import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <div className="sticky top-0 z-50">
      {/* Бегущая строка */}
      <div className="overflow-hidden bg-primary py-1.5 text-white">
        <div className="animate-marquee whitespace-nowrap text-xs font-medium">
          ⚡ Добро пожаловать в THE VOLT &nbsp;&nbsp;•&nbsp;&nbsp;
          🎮 Игровая периферия &nbsp;&nbsp;•&nbsp;&nbsp;
          📱 Аксессуары для телефона &nbsp;&nbsp;•&nbsp;&nbsp;
          🚗 Товары для авто &nbsp;&nbsp;•&nbsp;&nbsp;
          🎧 Электроника и гаджеты &nbsp;&nbsp;•&nbsp;&nbsp;
          👟 Одежда и обувь &nbsp;&nbsp;•&nbsp;&nbsp;
          ⚡ Добро пожаловать в THE VOLT &nbsp;&nbsp;•&nbsp;&nbsp;
          🎮 Игровая периферия &nbsp;&nbsp;•&nbsp;&nbsp;
          📱 Аксессуары для телефона &nbsp;&nbsp;•&nbsp;&nbsp;
          🚗 Товары для авто &nbsp;&nbsp;•&nbsp;&nbsp;
          🎧 Электроника и гаджеты &nbsp;&nbsp;•&nbsp;&nbsp;
          👟 Одежда и обувь
        </div>
      </div>

      {/* Основная шапка */}
      <header className="border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-3">

          {/* Логотип */}
          <Link href="/" className="text-xl font-bold text-primary">
            THE VOLT
          </Link>

          {/* Центр — слоган */}
          <div className="hidden text-center sm:block">
            <span className="animate-pulse text-lg">⚡</span>
            <span className="ml-1 text-sm font-semibold tracking-wide">
              Заряди свою жизнь
            </span>
          </div>

          {/* Навигация */}
          <nav className="flex items-center justify-end gap-5">
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              Каталог
            </Link>
            <Link href="/cart" className="text-sm font-medium hover:text-primary">
              Корзина
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary">
              Контакты
            </Link>
            <a
              href="https://thevoltshop.github.io/my-site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-primary"
            >
              Помощь
            </a>
            <ThemeToggle />
          </nav>

        </div>
      </header>
    </div>
  );
}
