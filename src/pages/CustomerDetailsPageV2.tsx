import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCustomer, useUpdateCustomer } from "@/hooks/useCustomers";
import { useCustomerOrders } from "@/hooks/useOrders";
import type { CustomerFormData } from "@/lib/validations";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import CustomerProfileSummary from "@/components/customers/CustomerProfileSummary";
import CustomerOrdersHistory from "@/components/customers/CustomerOrdersHistory";
import { Edit3, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CustomerDetailsPageV2() {
  const { id } = useParams<{ id: string }>();
  const customerQuery = useCustomer(id);
  const ordersQuery = useCustomerOrders(id);
  const update = useUpdateCustomer();
  const [editOpen, setEditOpen] = useState(false);
  if (customerQuery.isLoading || ordersQuery.isLoading)
    return (
      <LoadingState
        message="جاري تحميل بيانات العميل والطلبات..."
        variant="detail"
      />
    );
  if (customerQuery.isError || ordersQuery.isError || !customerQuery.data)
    return (
      <ErrorState
        message="تعذر تحميل بيانات العميل"
        onRetry={customerQuery.refetch}
      />
    );
  const customer = customerQuery.data;
  const orders = ordersQuery.data ?? [];
  const save = async (data: CustomerFormData) => {
    try {
      await update.mutateAsync({ id: customer.id, data });
      toast.success("تم تحديث بيانات العميل بنجاح");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "فشل في تحديث بيانات العميل",
      );
    }
  };
  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title={customer.name}
        subtitle="سجل الطلبات والمقاسات التاريخية للعميل"
        action={
          <div className="flex w-full gap-3 sm:w-auto">
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-bold text-text-primary shadow-2xs hover:bg-gray-50 sm:flex-none"
            >
              <Edit3 className="size-4 text-primary" />
              تعديل البيانات
            </button>
            <Link
              to={`/orders/new?customerId=${customer.id}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-md hover:bg-primary-dark sm:flex-none"
            >
              <Plus className="size-5" />
              طلب جديد لهذا العميل
            </Link>
          </div>
        }
      />
      <CustomerProfileSummary customer={customer} orderCount={orders.length} />
      <CustomerOrdersHistory customer={customer} orders={orders} />
      <CustomerFormModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={save}
        customer={customer}
        isLoading={update.isPending}
      />
    </div>
  );
}
