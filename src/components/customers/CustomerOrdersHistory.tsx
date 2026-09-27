import type { Customer, Order } from "@/types";
import { ClipboardList, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CustomerOrderCard from "./CustomerOrderCard";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/shared/PaginationControls";

export default function CustomerOrdersHistory({
  customer,
  orders,
}: {
  customer: Customer;
  orders: Order[];
}) {
  const pagination = usePagination(orders, customer.id);
  return (
    <section className="space-y-6">
      <h3 className="flex items-center gap-2 text-xl font-bold text-text-primary">
        <ClipboardList className="size-5 text-primary" />
        تاريخ الطلبات والمقاسات
      </h3>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <p className="mb-4 font-medium text-text-secondary">
            لا توجد طلبات سابقة لهذا العميل
          </p>
          <Link
            to={`/orders/new?customerId=${customer.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            <Plus className="size-4" />
            إنشاء أول طلب
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pagination.visibleItems.map((order, index) => (
            <CustomerOrderCard
              key={order.id}
              order={order}
              sequence={orders.length - (pagination.page - 1) * 6 - index}
            />
          ))}
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
