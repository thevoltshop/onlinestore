import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { OrderStatusForm } from "./OrderStatusForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-muted hover:text-primary">
        ← Назад к заказам
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted">
            {new Date(order.createdAt).toLocaleString("ru-RU")}
          </p>
        </div>
        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Клиент</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div><dt className="text-muted">Имя</dt><dd>{order.customerName}</dd></div>
            <div><dt className="text-muted">Email</dt><dd>{order.customerEmail}</dd></div>
            {order.customerPhone && (
              <div><dt className="text-muted">Телефон</dt><dd>{order.customerPhone}</dd></div>
            )}
            <div><dt className="text-muted">Адрес</dt><dd>{order.address}</dd></div>
            {order.notes && (
              <div><dt className="text-muted">Комментарий</dt><dd>{order.notes}</dd></div>
            )}
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Товары</h2>
          <div className="mt-3 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Итого</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
