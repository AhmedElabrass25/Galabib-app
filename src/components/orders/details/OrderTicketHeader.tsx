import type { Order, OrderStatus } from "@/types";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Scissors, User, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderTicketHeaderProps {
  order: Order;
  garmentLabel: string;
  onStatusChange: (status: OrderStatus) => void;
}

export default function OrderTicketHeader({
  order,
  garmentLabel,
  onStatusChange,
}: OrderTicketHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-6 border-b border-gray-200 pb-6 md:flex-row md:items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 text-2xl font-black text-text-primary">
            <Scissors className="size-6 text-primary print:hidden" />
            {garmentLabel}
          </h2>
          <OrderStatusBadge status={order.status} className="print:hidden" />
        </div>
        {order.customer && (
          <div className="flex flex-wrap items-center gap-4 text-base font-bold text-text-secondary">
            <Link
              to={`/customers/${order.customer.id}`}
              className="flex items-center gap-1.5 text-text-primary hover:text-primary print:no-underline"
            >
              <User className="size-5 text-secondary print:hidden" />
              العميل: {order.customer.name}
            </Link>
            <span
              dir="ltr"
              className="flex items-center gap-1 font-mono text-text-primary"
            >
              <Phone className="size-4 text-text-muted print:hidden" />
              {order.customer.phone}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1.5 rounded-xl border border-gray-200 bg-gray-50 p-3 print:hidden">
        <label className="block text-xs font-bold text-text-secondary">
          تغيير حالة الطلب:
        </label>
        <Select
          value={order.status}
          onValueChange={(value) => onStatusChange(value as OrderStatus)}
        >
          <SelectTrigger className="min-h-10 w-full min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
            <SelectItem value="ready">جاهز للتسليم</SelectItem>
            <SelectItem value="delivered">تم التسليم</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
