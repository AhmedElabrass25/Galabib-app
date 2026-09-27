import { useState } from "react";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/useCustomers";
import type { Customer } from "@/types";
import type { CustomerFormData } from "@/lib/validations";
import PageHeader from "@/components/shared/PageHeader";
import CustomerList from "@/components/customers/CustomerList";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import { Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import usePagination from "@/hooks/usePagination";
import PaginationControls from "@/components/shared/PaginationControls";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
    null,
  );

  const {
    data: customers = [],
    isLoading,
    isError,
    refetch,
  } = useCustomers(search);
  const pagination = usePagination(customers, search);
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (formData: CustomerFormData) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({
          id: editingCustomer.id,
          data: formData,
        });
        toast.success("تم تحديث بيانات العميل بنجاح");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("تم إضافية العميل بنجاح");
      }
    } catch (err: any) {
      toast.error(err.message || "حدث خطأ أثناء حفظ البيانات");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCustomer) return;
    try {
      await deleteMutation.mutateAsync(deletingCustomer.id);
      toast.success("تم حذف العميل وكل طلباته بنجاح");
      setDeletingCustomer(null);
    } catch (err: any) {
      toast.error(err.message || "فشل في حذف العميل");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="دليل العملاء"
        subtitle="إدارة بيانات عملاء المحل وسجل طلباتهم"
        action={
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            <span>إضافة عميل جديد</span>
          </button>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="ابحث باسم العميل أو رقم الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-xl pr-10 pl-4 py-2.5 text-sm font-semibold text-text-primary outline-hidden focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-all"
        />
        <Search className="w-5 h-5 text-text-muted absolute right-3 top-3" />
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState
          message="جاري تحميل قائمة العملاء..."
          variant="customers"
        />
      ) : isError ? (
        <ErrorState message="تعذر تحميل قائمة العملاء" onRetry={refetch} />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title={search ? "لم يتم العثور على نتائج" : "لا يوجد عملاء بعد"}
          description={
            search
              ? "تأكد من كتابة اسم العميل أو رقم الهاتف بشكل صحيح"
              : "قم بإضافة أول عميل في النظام للبدء في تسجبل المقاسات والطلبات"
          }
          actionLabel={search ? undefined : "إضافة عميل جديد"}
          onAction={search ? undefined : handleOpenAddModal}
        />
      ) : (
        <CustomerList
          customers={pagination.visibleItems}
          onEdit={handleOpenEditModal}
          onDelete={(c) => setDeletingCustomer(c)}
        />
      )}
      {!isLoading && !isError && customers.length > 0 && (
        <PaginationControls
          page={pagination.page}
          pageCount={pagination.pageCount}
          total={pagination.total}
          onPageChange={pagination.setPage}
        />
      )}

      {/* Add/Edit Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCustomer}
        customer={editingCustomer}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف العميل"
        description={`هل أنت تأكد من حذف العميل "${deletingCustomer?.name}"؟ سيتم حذف جميع الطلبات والمقاسات الخاصة به نهائيًا ولا يمكن التراجع.`}
        confirmText="نعم، احذف العميل"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
