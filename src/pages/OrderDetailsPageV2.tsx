import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useOrder,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "@/hooks/useOrders";
import type { OrderStatus } from "@/types";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import OrderTicket from "@/components/orders/details/OrderTicket";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";
import { ArrowRight, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailsPageV2() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [confirmDelete, setConfirmDelete] = useState(false);
  if (isLoading)
    return (
      <LoadingState message="جاري تحميل تفاصيل الطلب..." variant="detail" />
    );
  if (isError || !order)
    return <ErrorState message="تعذر تحميل الطلب" onRetry={refetch} />;
  const garmentLabel =
    GARMENT_TYPE_LABELS[order.garment_type] || order.garment_type;
  const setStatus = async (status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل في تحديث حالة الطلب",
      );
    }
  };
  const confirm = async () => {
    try {
      await deleteOrder.mutateAsync(order.id);
      toast.success("تم حذف الطلب بنجاح");
      navigate("/orders");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "فشل في حذف الطلب");
    }
  };
  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <Link
        to="/orders"
        className="print:hidden inline-flex items-center gap-2 text-sm font-bold text-text-secondary transition-colors hover:text-primary"
      >
        <ArrowRight className="size-4" />
        العودة لقائمة الطلبات
      </Link>
      <PageHeader
        title={`طلب ${garmentLabel}`}
        subtitle={`تاريخ الطلب: ${formatDate(order.created_at)}`}
        action={
          <div className="print:hidden flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-text-primary shadow-2xs hover:bg-gray-50"
            >
              <Printer className="size-4 text-primary" />
              طباعة كارت التفصيل
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              <Trash2 className="size-4" />
              حذف
            </button>
          </div>
        }
      />
      <OrderTicket
        order={order}
        garmentLabel={garmentLabel}
        onStatusChange={setStatus}
      />
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={confirm}
        title="حذف الطلب"
        description="هل أنت تأكد من حذف هذا الطلب نهائيًا؟"
        confirmText="نعم، احذف"
        isLoading={deleteOrder.isPending}
      />
    </div>
  );
}
