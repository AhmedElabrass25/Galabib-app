import { useState, useMemo } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useUpdateOrderStatus } from "@/hooks/useOrders";
import PageHeader from "@/components/shared/PageHeader";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { GARMENT_TYPE_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";
import type { Order, OrderStatus } from "@/types";
import {
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Eye,
  Calendar,
  Layers,
  ListFilter,
  Scissors,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type PriorityTab = "all" | "overdue" | "today" | "tomorrow" | "ready";

export default function PriorityBoardPage() {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [activeTab, setActiveTab] = useState<PriorityTab>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Normalized dates for accurate comparison
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  // Filter active orders (not delivered or cancelled)
  const activeOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status !== "delivered" && o.status !== "cancelled",
    );
  }, [orders]);

  // Group orders by urgency
  const groupedOrders = useMemo(() => {
    const overdue: Order[] = [];
    const today: Order[] = [];
    const tomorrow: Order[] = [];
    const ready: Order[] = [];
    const upcoming: Order[] = [];

    activeOrders.forEach((order) => {
      if (order.status === "ready") {
        ready.push(order);
      } else if (order.delivery_date < todayStr) {
        overdue.push(order);
      } else if (order.delivery_date === todayStr) {
        today.push(order);
      } else if (order.delivery_date === tomorrowStr) {
        tomorrow.push(order);
      } else {
        upcoming.push(order);
      }
    });

    return { overdue, today, tomorrow, ready, upcoming };
  }, [activeOrders, todayStr, tomorrowStr]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success(`تم تحديث حالة الطلب إلى "${ORDER_STATUS_LABELS[status]}"`);
    } catch {
      toast.error("فشل في تحديث حالة الطلب");
    }
  };

  const getWhatsAppLink = (
    phone: string,
    customerName: string,
    garment: string,
    status: string,
  ) => {
    let cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.startsWith("2") && cleanPhone.startsWith("0")) {
      cleanPhone = "2" + cleanPhone;
    }
    let text = `أهلاً أستاذ ${customerName}، تفاصيل طلب تفصيل (${GARMENT_TYPE_LABELS[garment as keyof typeof GARMENT_TYPE_LABELS] || garment}): `;
    if (status === "ready") {
      text += "الجلابية جاهزة للاستلام الآن بالمحل. يشرفنا زيارتك!";
    } else {
      text +=
        "نحيطك علماً بأن الطلب جاري العمل عليه في الورشة وسيتم إبلاغك فور الجاهزية.";
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  if (isLoading)
    return (
      <LoadingState
        message="جاري تحميل لوحة المواعيد الحرجة..."
        variant="dashboard"
      />
    );

  if (isError)
    return (
      <ErrorState
        message="تعذر تحميل طلبات المواعيد الحرجة"
        onRetry={refetch}
      />
    );

  const filteredOrdersList = () => {
    switch (activeTab) {
      case "overdue":
        return groupedOrders.overdue;
      case "today":
        return groupedOrders.today;
      case "tomorrow":
        return groupedOrders.tomorrow;
      case "ready":
        return groupedOrders.ready;
      default:
        return activeOrders;
    }
  };

  const calculateDelayDays = (deliveryDateStr: string) => {
    const diffTime =
      new Date(todayStr).getTime() - new Date(deliveryDateStr).getTime();
    return Math.floor(diffTime / (1000 * 3600 * 24));
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12 text-right">
      <PageHeader
        title="شاشة المواعيد الحرجة والتأخير ⏱️"
        subtitle="متابعة الطلبات العاجلة والمتأخرة لترتيب أولويات الورشة وتوفير أفضل خدمة للعملاء"
        action={
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 shadow-2xs">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "kanban"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-text-secondary hover:bg-gray-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              عرض الأعمدة
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-text-secondary hover:bg-gray-100"
              }`}
            >
              <ListFilter className="w-4 h-4" />
              عرض القائمة
            </button>
          </div>
        }
      />

      {/* KPI Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overdue Card */}
        <div
          onClick={() => setActiveTab("overdue")}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === "overdue"
              ? "border-rose-500 bg-rose-50 ring-2 ring-rose-300"
              : "border-rose-200 bg-rose-50/50 hover:bg-rose-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-rose-800">
              متأخرة عن الموعد
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-900 mt-2">
            {groupedOrders.overdue.length}
          </p>
          <p className="text-xs text-rose-700 font-semibold mt-1">
            تتطلب الإنهاء الفوري بالورشة!
          </p>
        </div>

        {/* Due Today Card */}
        <div
          onClick={() => setActiveTab("today")}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === "today"
              ? "border-amber-500 bg-amber-50 ring-2 ring-amber-300"
              : "border-amber-200 bg-amber-50/50 hover:bg-amber-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-amber-800">
              تسليم اليوم
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-900 mt-2">
            {groupedOrders.today.length}
          </p>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            مستحقة التسليم اليوم
          </p>
        </div>

        {/* Due Tomorrow Card */}
        <div
          onClick={() => setActiveTab("tomorrow")}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === "tomorrow"
              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
              : "border-blue-200 bg-blue-50/50 hover:bg-blue-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-blue-800">تسليم غداً</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-900 mt-2">
            {groupedOrders.tomorrow.length}
          </p>
          <p className="text-xs text-blue-700 font-semibold mt-1">
            للتجهيز والمتابعة المسبقة
          </p>
        </div>

        {/* Ready Pending Delivery */}
        <div
          onClick={() => setActiveTab("ready")}
          className={`cursor-pointer p-5 rounded-2xl border transition-all ${
            activeTab === "ready"
              ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300"
              : "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-emerald-800">
              جاهز بالمحل
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-900 mt-2">
            {groupedOrders.ready.length}
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            في انتظار استلام الزبون
          </p>
        </div>
      </div>

      {/* Main View Modes */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* Column 1: Overdue */}
          <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50/40 p-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-rose-200">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <h4 className="font-black text-rose-900">متأخرة عن الموعد</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                {groupedOrders.overdue.length}
              </span>
            </div>
            {groupedOrders.overdue.length === 0 ? (
              <p className="text-xs text-rose-600 font-semibold text-center py-8">
                🎉 ممتاز! لا توجد أي طلبات متأخرة
              </p>
            ) : (
              groupedOrders.overdue.map((order) => (
                <OrderPriorityCard
                  key={order.id}
                  order={order}
                  variant="overdue"
                  delayDays={calculateDelayDays(order.delivery_date)}
                  onStatusChange={handleStatusChange}
                  getWhatsAppLink={getWhatsAppLink}
                />
              ))
            )}
          </div>

          {/* Column 2: Due Today */}
          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h4 className="font-black text-amber-900">تسليم اليوم</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
                {groupedOrders.today.length}
              </span>
            </div>
            {groupedOrders.today.length === 0 ? (
              <p className="text-xs text-amber-700 font-semibold text-center py-8">
                لا توجد طلبات مستحقة التسليم اليوم
              </p>
            ) : (
              groupedOrders.today.map((order) => (
                <OrderPriorityCard
                  key={order.id}
                  order={order}
                  variant="today"
                  onStatusChange={handleStatusChange}
                  getWhatsAppLink={getWhatsAppLink}
                />
              ))
            )}
          </div>

          {/* Column 3: Due Tomorrow */}
          <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50/40 p-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-black text-blue-900">تسليم غداً</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500 text-white">
                {groupedOrders.tomorrow.length}
              </span>
            </div>
            {groupedOrders.tomorrow.length === 0 ? (
              <p className="text-xs text-blue-700 font-semibold text-center py-8">
                لا توجد طلبات لموعد الغد
              </p>
            ) : (
              groupedOrders.tomorrow.map((order) => (
                <OrderPriorityCard
                  key={order.id}
                  order={order}
                  variant="tomorrow"
                  onStatusChange={handleStatusChange}
                  getWhatsAppLink={getWhatsAppLink}
                />
              ))
            )}
          </div>

          {/* Column 4: Ready for Delivery */}
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-black text-emerald-900">جاهز للتسليم</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                {groupedOrders.ready.length}
              </span>
            </div>
            {groupedOrders.ready.length === 0 ? (
              <p className="text-xs text-emerald-700 font-semibold text-center py-8">
                لا توجد ثياب معلقة تنتظر الاستلام
              </p>
            ) : (
              groupedOrders.ready.map((order) => (
                <OrderPriorityCard
                  key={order.id}
                  order={order}
                  variant="ready"
                  onStatusChange={handleStatusChange}
                  getWhatsAppLink={getWhatsAppLink}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              جميع الطلبات النشطة ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab("overdue")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "overdue"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              متأخرة ({groupedOrders.overdue.length})
            </button>
            <button
              onClick={() => setActiveTab("today")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "today"
                  ? "bg-amber-500 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              تسليم اليوم ({groupedOrders.today.length})
            </button>
            <button
              onClick={() => setActiveTab("tomorrow")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "tomorrow"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              تسليم غداً ({groupedOrders.tomorrow.length})
            </button>
            <button
              onClick={() => setActiveTab("ready")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === "ready"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              جاهز بمحل ({groupedOrders.ready.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrdersList().map((order) => {
              let variant:
                | "overdue"
                | "today"
                | "tomorrow"
                | "ready"
                | "normal" = "normal";
              if (order.status === "ready") variant = "ready";
              else if (order.delivery_date < todayStr) variant = "overdue";
              else if (order.delivery_date === todayStr) variant = "today";
              else if (order.delivery_date === tomorrowStr)
                variant = "tomorrow";

              return (
                <OrderPriorityCard
                  key={order.id}
                  order={order}
                  variant={variant}
                  delayDays={
                    variant === "overdue"
                      ? calculateDelayDays(order.delivery_date)
                      : undefined
                  }
                  onStatusChange={handleStatusChange}
                  getWhatsAppLink={getWhatsAppLink}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface OrderPriorityCardProps {
  order: Order;
  variant: "overdue" | "today" | "tomorrow" | "ready" | "normal";
  delayDays?: number;
  onStatusChange: (id: string, status: OrderStatus) => void;
  getWhatsAppLink: (
    phone: string,
    name: string,
    garment: string,
    status: string,
  ) => string;
}

function OrderPriorityCard({
  order,
  variant,
  delayDays,
  onStatusChange,
  getWhatsAppLink,
}: OrderPriorityCardProps) {
  const cardBorderClass =
    variant === "overdue"
      ? "border-rose-300 bg-white hover:border-rose-500 shadow-rose-100"
      : variant === "today"
        ? "border-amber-300 bg-white hover:border-amber-500 shadow-amber-100"
        : variant === "tomorrow"
          ? "border-blue-300 bg-white hover:border-blue-500 shadow-blue-100"
          : variant === "ready"
            ? "border-emerald-300 bg-white hover:border-emerald-500 shadow-emerald-100"
            : "border-gray-200 bg-white hover:border-gray-300";

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm transition-all space-y-3 relative ${cardBorderClass}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            to={`/orders/${order.id}`}
            className="font-black text-text-primary text-base hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>{order.customer?.name || "عميل غير معرف"}</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
            <span className="font-semibold">
              {GARMENT_TYPE_LABELS[order.garment_type]}
            </span>
            <span>•</span>
            <span className="font-bold text-primary">
              {order.quantity} قطعة
            </span>
            {order.sadary_count > 0 && (
              <span>(+ {order.sadary_count} سديري)</span>
            )}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Date & Urgency Banner */}
      <div className="flex items-center justify-between text-xs font-bold pt-1 border-t border-gray-100">
        <span className="text-text-muted flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(order.delivery_date)}
        </span>

        {variant === "overdue" && (
          <span className="text-rose-600 font-black flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            متأخر {delayDays} يوم!
          </span>
        )}
        {variant === "today" && (
          <span className="text-amber-700 font-black flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            تاريخ التسليم اليوم!
          </span>
        )}
        {variant === "tomorrow" && (
          <span className="text-blue-700 font-black">تسليم غداً</span>
        )}
        {variant === "ready" && (
          <span className="text-emerald-700 font-black">
            جاهز بانتظار الاستلام
          </span>
        )}
      </div>

      {order.notes && (
        <p className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-2 text-xs font-semibold text-text-primary">
          "{order.notes}"
        </p>
      )}

      {/* Quick Action buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          {order.customer?.phone && (
            <>
              <a
                href={`tel:${order.customer.phone}`}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="اتصال تلفوني"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppLink(
                  order.customer.phone,
                  order.customer.name,
                  order.garment_type,
                  order.status,
                )}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                title="مراسلة عبر الواتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </>
          )}
          <Link
            to={`/orders/${order.id}`}
            className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            title="عرض التفاصيل والمقاسات"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Status Toggle */}
        {order.status !== "ready" && order.status !== "delivered" && (
          <button
            onClick={() => onStatusChange(order.id, "ready")}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-xs active:scale-95 flex items-center gap-1"
          >
            <Scissors className="w-3.5 h-3.5" />
            تعليم كـ جاهز
          </button>
        )}
        {order.status === "ready" && (
          <button
            onClick={() => onStatusChange(order.id, "delivered")}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-black transition-all shadow-xs active:scale-95 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            تعليم كـ تم التسليم
          </button>
        )}
      </div>
    </div>
  );
}
