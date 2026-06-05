import { Header } from "@/components/Header";

export default function ContactsPage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold">Контакты</h1>
        <p className="mb-10 text-muted">Свяжитесь с нами любым удобным способом</p>

        <div className="grid gap-4 sm:grid-cols-2">

          {/* Телефон */}
          <a
            href="tel:+998330112212"
            className="card flex items-center gap-4 p-5 hover:shadow-md transition"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl">
              📞
            </div>
            <div>
              <p className="text-sm text-muted">Телефон</p>
              <p className="font-semibold">+998 33 011-22-12</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:dddm2055@gmail.com"
            className="card flex items-center gap-4 p-5 hover:shadow-md transition"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-2xl">
              ✉️
            </div>
            <div>
              <p className="text-sm text-muted">Email</p>
              <p className="font-semibold">dddm2055@gmail.com</p>
            </div>
          </a>

          {/* Telegram 1 */}
          <a
            href="https://t.me/+998330112212"
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-4 p-5 hover:shadow-md transition"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-2xl">
              ✈️
            </div>
            <div>
              <p className="text-sm text-muted">Telegram</p>
              <p className="font-semibold">+998 33 011-22-12</p>
            </div>
          </a>

          {/* Telegram 2 */}
          <a
            href="https://t.me/+998334425767"
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-center gap-4 p-5 hover:shadow-md transition"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-2xl">
              ✈️
            </div>
            <div>
              <p className="text-sm text-muted">Telegram</p>
              <p className="font-semibold">+998 33 442-57-67</p>
            </div>
          </a>

        </div>

        {/* Часы работы */}
        <div className="card mt-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-2xl">
              🕙
            </div>
            <div>
              <p className="text-sm text-muted">Часы работы</p>
              <p className="font-semibold">Понедельник — Воскресенье: 10:00 – 00:00</p>
            </div>
          </div>
        </div>

        {/* Доп. текст */}
        <p className="mt-8 text-center text-sm text-muted">
          Отвечаем в Telegram в течение 15 минут в рабочее время
        </p>
      </main>

      <footer className="mt-8 border-t border-border py-8 text-center text-sm text-muted">
        © 2026 THE VOLT. Управление через{" "}
        <a href="/admin" className="text-primary hover:underline">
          админ-панель
        </a>
      </footer>
    </div>
  );
}
