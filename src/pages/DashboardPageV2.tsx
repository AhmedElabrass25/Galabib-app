import { Plus } from "lucide-react";
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
      <RecentOrdersSection orders={stats.recentOrders} />
    </div>
  );
}
