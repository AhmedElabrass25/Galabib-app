import { Plus, Flame, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import PageHeader from "@/components/shared/PageHeader";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";
import RecentOrdersSection from "@/components/dashboard/RecentOrdersSection";

export default function DashboardPageV2() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  if (isLoading)
    return (
      <LoadingState message="جاري تحميل لوحة التحكم..." variant="dashboard" />
    );
  if (isError || !stats)
    return (
      <ErrorState message="تعذر تحميل بيانات لوحة التحكم" onRetry={refetch} />
    );
  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="الرئيسية"
        subtitle="مرحبًا بك في نظام إدارة تفصيل الجلابيب"
        action={
          <Link
            to="/orders/new"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-slate-900 px-6 text-base font-bold text-white shadow-2xs transition-all hover:bg-slate-800 active:scale-95"
          >
            <Plus className="size-5 text-sky-400" />
            إنشاء طلب جديد
          </Link>
        }
      />
      <DashboardStatsCards
        customers={stats.totalCustomers}
        todayOrders={stats.todayOrdersCount}
        upcomingOrders={stats.upcomingOrdersCount}
      />

      {/* Priority Banner Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>شاشة المواعيد الحرجة والتأخير</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-400 text-slate-950 font-black">جديد 🔥</span>
            </h3>
            <p className="text-xs text-slate-300 font-semibold mt-1">
              تابع الطلبات المستحقة التسليم اليوم وغداً والطلبات المتأخرة لتنسيق عمل الورشة أولاً بأول.
            </p>
          </div>
        </div>
        <Link
          to="/priority"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-sm shrink-0 active:scale-95"
        >
          <span>فتح لوحة المواعيد الحرجة</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <RecentOrdersSection orders={stats.recentOrders} />
    </div>
  );
}
