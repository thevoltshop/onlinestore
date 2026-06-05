import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [productCount, categoryCount, orderCount, recentOrders, lowStock] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, isActive: true },
        take: 5,
      }),
    ]);

  const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });

  return (
    <div>
      <h1 className="text-2xl font-bold">Дашборд</h1>
      <p className="text-muted">Добро пожаловать, {session.name}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Товары", value: productCount, href: "/admin/products" },
          { label: "Категории", value: categoryCount, href: "/admin/categories" },
          { label: "Заказы", value: orderCount, href: "/admin/orders" },
          {
            label: "Выручка",
            value: formatPrice(totalRevenue._sum.total || 0),
            href: "/admin/orders",
          },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-5 hover:shadow-md">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-semibold">Последние заказы</h2>
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(order.total)}</p>
                  <span className="badge bg-blue-100 text-blue-800">{order.status}</span>
                </div>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted">Заказов пока нет</p>
            )}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Низкий остаток</h2>
          <div className="mt-4 space-y-3">
            {lowStock.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-gray-50"
              >
                <p className="font-medium">{product.name}</p>
                <span className="badge bg-red-100 text-red-800">{product.stock} шт.</span>
              </Link>
            ))}
            {lowStock.length === 0 && (
              <p className="text-sm text-muted">Все товары в достаточном количестве</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
