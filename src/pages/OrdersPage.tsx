import { useState } from "react";
import {
  useOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "@/hooks/useOrders";
import type { Order, OrderStatus, GarmentType } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import OrderList from "@/components/orders/OrderList";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { Plus, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import OrdersFilters from "@/components/orders/OrdersFilters";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/shared/PaginationControls";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [garmentFilter, setGarmentFilter] = useState<GarmentType | "">("");
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useOrders({
    search,
    status: statusFilter,
    garment_type: garmentFilter,
  });

  const updateStatusMutation = useUpdateOrderStatus();
  const deleteMutation = useDeleteOrder();
  const pagination = usePagination(
    orders,
    `${search}|${statusFilter}|${garmentFilter}`,
  );

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (err: any) {
      toast.error(err.message || "فشل في تحديث حالة الطلب");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingOrder) return;
    try {
      await deleteMutation.mutateAsync(deletingOrder.id);
      toast.success("تم حذف الطلب بنجاح");
      setDeletingOrder(null);
    } catch (err: any) {
      toast.error(err.message || "فشل في حذف الطلب");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="إدارة الطلبات"
        subtitle="جميع طلبات التثفصيل وحالات تنفيذها ومواعيد تسليمها"
        action={
          <Link
            to="/orders/new"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>طلب جديد</span>
          </Link>
        }
      />

      <OrdersFilters
        search={search}
        status={statusFilter}
        garment={garmentFilter}
        onSearch={setSearch}
        onStatus={setStatusFilter}
        onGarment={setGarmentFilter}
      />

      {/* Content */}
      {isLoading ? (
        <LoadingState message="جاري تحميل الطلبات..." variant="orders" />
      ) : isError ? (
        <ErrorState message="تعذر تحميل قائمة الطلبات" onRetry={refetch} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-10 h-10" />}
          title={
            search || statusFilter || garmentFilter
              ? "لا توجد نتائج مطابقة"
              : "لا توجد طلبات بعد"
          }
          description={
            search || statusFilter || garmentFilter
              ? "جرّب تغيير خيارات الفلترة أو مصطلح البحث"
              : "قم بإضافة أول طلب تفصيل جلابية في النظام"
          }
          actionLabel={
            search || statusFilter || garmentFilter
              ? undefined
              : "إضافة طلب جديد"
          }
          onAction={
            search || statusFilter || garmentFilter
              ? undefined
              : () => (window.location.href = "/orders/new")
          }
        />
      ) : (
        <OrderList
          orders={pagination.visibleItems}
          onStatusChange={handleStatusChange}
          onDelete={(o) => setDeletingOrder(o)}
        />
      )}
      {!isLoading && !isError && orders.length > 0 && (
        <PaginationControls
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
          onPageChange={pagination.setPage}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف الطلب"
        description="هل أنت تأكد من حذف هذا الطلب بجميع مقاساته الخواصة به؟ لا يمكن التراجع بعد الحذف."
        confirmText="نعم، احذف الطلب"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
