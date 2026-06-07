import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/types";

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  function statusLabel(status: string) {
    return ORDER_STATUSES.find((s) => s.value === status)?.label || status;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Заказы</h1>

      <div className="mt-6 overflow-x-auto">
        <table className="card w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-gray-50">
            <tr>
              <th className="p-4">Номер</th>
              <th className="p-4">Клиент</th>
              <th className="p-4">Сумма</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Дата</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border">
                <td className="p-4 font-medium">{order.orderNumber}</td>
                <td className="p-4">
                  <p>{order.customerName}</p>
                  <p className="text-muted">{order.customerEmail}</p>
                </td>
                <td className="p-4 font-bold">{formatPrice(order.total)}</td>
                <td className="p-4">
                  <span className="badge bg-blue-100 text-blue-800">
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="p-4 text-muted">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    Подробнее
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="mt-4 text-muted">Заказов пока нет</p>
        )}
      </div>
    </div>
  );
}
