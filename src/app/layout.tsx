import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnlineStore — Интернет-магазин",
  description: "Онлайн-магазин с админ-панелью для управления товарами",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
