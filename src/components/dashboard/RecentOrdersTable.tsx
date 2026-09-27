import type { Order } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[780px] text-right text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5">اسم العميل</th>
              <th className="whitespace-nowrap px-4 py-3.5">نوع الجلابية</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-center">
                العدد
              </th>
              <th className="whitespace-nowrap px-4 py-3.5">تاريخ التسليم</th>
              <th className="whitespace-nowrap px-4 py-3.5">الحالة</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-[#f6f9f6]"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900">
                  {order.customer ? (
                    <Link
                      to={`/customers/${order.customer.id}`}
                      className="hover:text-sky-700"
                    >
                      {order.customer.name}
                    </Link>
                  ) : (
                    "غير محدد"
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-700">
                  {GARMENT_TYPE_LABELS[order.garment_type] ||
                    order.garment_type}
                </td>
                <td className="px-4 py-3.5 text-center font-bold num-tabular">
                  {order.quantity}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-600 num-tabular">
                  {formatDate(order.delivery_date)}
                </td>
                <td className="px-4 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3.5 text-left">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex min-h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                  >
                    <Eye className="size-4 text-sky-700" />
                    <span>عرض التفاصيل</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
