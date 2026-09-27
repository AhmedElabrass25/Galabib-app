import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import CustomerFormModal from "@/components/customers/CustomerFormModal";
import type { CustomerFormData } from "@/lib/validations";
import CustomerSelectionStep from "@/components/orders/new-order/CustomerSelectionStep";
import OrderBasicsStep from "@/components/orders/new-order/OrderBasicsStep";
import MeasurementsStep from "@/components/orders/new-order/MeasurementsStep";
import useNewOrderDraft from "./useNewOrderDraft";
import useNewOrderActions from "./useNewOrderActions";
import useNewOrderSubmission from "./useNewOrderSubmission";

export default function NewOrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const draft = useNewOrderDraft(searchParams.get("customerId"));
  const actions = useNewOrderActions({
    orders: draft.customerOrders,
    setCustomerId: draft.setCustomerId,
    setMeasurements: draft.setMeasurements,
    setOptions: draft.setOptions,
  });
  const submission = useNewOrderSubmission(draft);
  if (draft.loadingCustomers)
    return (
      <LoadingState message="جاري إعداد نموذج الطلب الجديد..." variant="form" />
    );
  const customer = draft.customers.find((item) => item.id === draft.customerId);
  const saveCustomer = (data: CustomerFormData) => actions.addCustomer(data);

  return (
    <form
      onSubmit={submission.submit}
      noValidate
      className="animate-fade-in space-y-8 pb-12"
    >
      <PageHeader
        title="إنشاء طلب تفصيل جديد"
        subtitle="حدد العميل ونوع الجلابية وأدخل المقاسات المطلوبة"
      />
      <CustomerSelectionStep
        customers={draft.customers}
        customer={customer}
        selectedId={draft.customerId}
        error={submission.fieldErrors.customer}
        onSelect={(id) => {
          draft.setCustomerId(id);
          submission.clearError("customer");
        }}
        onAdd={() => draft.setIsCustomerModalOpen(true)}
      />
      <OrderBasicsStep
        garmentType={draft.garmentType}
        onGarmentTypeChange={draft.setGarmentType}
        quantity={draft.quantity}
        errors={submission.fieldErrors}
        sadaryCount={draft.sadaryCount}
        deliveryDate={draft.deliveryDate}
        notes={draft.notes}
        onQuantityChange={(value) => {
          draft.setQuantity(value);
          submission.clearError("quantity");
        }}
        onSadaryChange={(value) => {
          draft.setSadaryCount(value);
          submission.clearError("sadaryCount");
        }}
        onDeliveryDateChange={(value) => {
          draft.setDeliveryDate(value);
          submission.clearError("deliveryDate");
        }}
        onNotesChange={(value) => {
          draft.setNotes(value);
          submission.clearError("notes");
        }}
      />
      <MeasurementsStep
        customerId={draft.customerId}
        orders={draft.customerOrders}
        garmentType={draft.garmentType}
        measurements={draft.measurements}
        options={draft.options}
        errors={submission.fieldErrors}
        onCopy={actions.copyMeasurements}
        onChange={(measurements, options) => {
          draft.setMeasurements(measurements);
          draft.setOptions(options);
          submission.clearMeasurementErrors();
        }}
      />
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl border border-gray-300 px-6 py-3 font-bold text-text-primary hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={submission.createOrder.isPending}
          className="rounded-xl bg-primary px-8 py-3.5 text-base font-extrabold text-white shadow-lg transition-all hover:bg-primary-dark disabled:opacity-50"
        >
          {submission.createOrder.isPending
            ? "جاري إنشاء الطلب..."
            : "حفظ الطلب والمقاسات"}
        </button>
      </div>
      <CustomerFormModal
        isOpen={draft.isCustomerModalOpen}
        onClose={() => draft.setIsCustomerModalOpen(false)}
        onSubmit={saveCustomer}
        isLoading={actions.createCustomer.isPending}
      />
    </form>
  );
}
