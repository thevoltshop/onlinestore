export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export const ORDER_STATUSES = [
  { value: "pending", label: "Ожидает" },
  { value: "confirmed", label: "Подтверждён" },
  { value: "shipped", label: "Отправлен" },
  { value: "delivered", label: "Доставлен" },
  { value: "cancelled", label: "Отменён" },
] as const;
