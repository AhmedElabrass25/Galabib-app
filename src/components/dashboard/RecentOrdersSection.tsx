import type { Order } from "@/types";
import { ArrowLeft, Plus, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import RecentOrdersTable from "./RecentOrdersTable";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/shared/PaginationControls";

export default function RecentOrdersSection({ orders }: { orders: Order[] }) {
  const pagination = usePagination(orders);
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-slate-900">
          <Scissors className="size-6 text-sky-600" />
          آخر الطلبات
        </h2>
        <Link
          to="/orders"
          className="flex items-center gap-1.5 text-sm font-bold text-sky-700 transition-colors hover:text-sky-900"
        >
          عرض كل الطلبات
          <ArrowLeft className="size-4" />
        </Link>
      </header>
      {orders.length ? (
        <RecentOrdersTable orders={pagination.visibleItems} />
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
          <p className="text-base font-bold text-slate-600">
            لا توجد طلبات مسجلة بعد في النظام
          </p>
          <Link
            to="/orders/new"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white"
          >
            <Plus className="size-4 text-sky-400" />
            إضافة أول طلب
          </Link>
        </div>
      )}
      <PaginationControls
        page={pagination.page}
        pageCount={pagination.pageCount}
        total={pagination.total}
        onPageChange={pagination.setPage}
      />
    </section>
  );
}
