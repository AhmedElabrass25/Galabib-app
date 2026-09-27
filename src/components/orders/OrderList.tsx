import type { Order, OrderStatus } from "@/types";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: Order[];
  onStatusChange?: (id: string, status: OrderStatus) => void;
  onDelete?: (order: Order) => void;
}

export default function OrderList({
  orders,
  onStatusChange,
  onDelete,
}: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
