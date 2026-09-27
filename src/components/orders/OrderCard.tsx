import type { Order, OrderStatus } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate, isOverdue, isDueSoon } from "@/lib/date-utils";
import OrderStatusBadge from "./OrderStatusBadge";
import { Eye, Calendar, Scissors, User, Phone, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderCardProps {
  order: Order;
  onStatusChange?: (id: string, status: OrderStatus) => void;
  onDelete?: (order: Order) => void;
}

export default function OrderCard({
  order,
  onStatusChange,
  onDelete,
}: OrderCardProps) {
  const garmentLabel =
    GARMENT_TYPE_LABELS[order.garment_type] || order.garment_type;
  const late = isOverdue(order.delivery_date) && order.status !== "delivered";
  const soon = isDueSoon(order.delivery_date) && order.status !== "delivered";
  return (
    <article
      className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 shadow-2xs transition-all hover:shadow-xs md:flex-row md:items-center ${late ? "border-rose-300 bg-rose-50/20" : soon ? "border-amber-300 bg-amber-50/20" : "border-slate-200 hover:border-slate-300"}`}
    >
      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 text-xl font-black text-slate-900">
            <Scissors className="size-5 text-sky-600" />
            {garmentLabel}
          </span>
          <OrderStatusBadge status={order.status} />
          {late && (
            <span className="rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800">
              متأخر عن الموعد!
            </span>
          )}
          {soon && (
            <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
              اقترب موعد التسليم
            </span>
          )}
        </div>
        {order.customer && (
          <div className="flex flex-wrap items-center gap-4 text-base font-semibold text-slate-600">
            <Link
              to={`/customers/${order.customer.id}`}
              className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-sky-700"
            >
              <User className="size-4 text-sky-600" />
              {order.customer.name}
            </Link>
            <span
              dir="ltr"
              className="flex items-center gap-1 font-mono text-sm font-bold text-slate-600 num-tabular"
            >
              <Phone className="size-3.5 text-slate-400" />
              {order.customer.phone}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold text-slate-600">
          <span className="rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1.5">
            العدد:{" "}
            <strong className="text-sm text-slate-900 num-tabular">
              {order.quantity}
            </strong>
          </span>
          {order.sadary_count > 0 && (
            <span className="rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1.5">
              سداري:{" "}
              <strong className="text-sm text-slate-900 num-tabular">
                {order.sadary_count}
              </strong>
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-950">
            <Calendar className="size-4 text-sky-700" />
            تاريخ التسليم:{" "}
            <strong className="font-bold num-tabular">
              {formatDate(order.delivery_date)}
            </strong>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
        {onStatusChange && (
          <Select
            value={order.status}
            onValueChange={(value) =>
              onStatusChange(order.id, value as OrderStatus)
            }
          >
            <SelectTrigger className="min-h-11 w-full md:w-44">
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
        )}
        <Link
          to={`/orders/${order.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-2xs transition-all hover:bg-slate-800"
        >
          <Eye className="size-4 text-sky-400" />
          <span>التفاصيل</span>
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(order)}
            className="rounded-xl border border-transparent p-2.5 text-slate-400 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            title="حذف الطلب"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </article>
  );
}
