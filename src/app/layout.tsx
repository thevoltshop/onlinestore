import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "THE ARX — Интернет-магазин в Узбекистане",
    template: "%s | THE ARX",
  },
  description: "THE ARX — интернет-магазин в Узбекистане. Игровая периферия, товары для авто, электроника и аксессуары с доставкой по всему Узбекистану.",
  keywords: ["интернет-магазин Узбекистан", "купить электронику Ташкент", "игровая периферия Узбекистан", "товары для авто Ташкент", "THE ARX"],
  authors: [{ name: "THE ARX" }],
  openGraph: {
    title: "THE ARX — Интернет-магазин в Узбекистане",
    description: "Игровая периферия, товары для авто, электроника и аксессуары с доставкой по всему Узбекистану.",
    url: "https://onlinestore-indol-seven.vercel.app",
    siteName: "THE ARX",
    locale: "ru_RU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Устанавливаем тему до рендера — убирает мигание */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var h=new Date().getHours();var t=s||(h>=20||h<8?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark')})()`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
