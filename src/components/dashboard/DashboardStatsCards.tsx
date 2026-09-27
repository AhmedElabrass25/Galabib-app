import { Calendar, ShoppingBag, Users } from "lucide-react";

interface DashboardStatsCardsProps {
  customers: number;
  todayOrders: number;
  upcomingOrders: number;
}

const cards = [
  {
    key: "customers",
    title: "إجمالي العملاء",
    icon: Users,
    iconClass: "border-sky-200 bg-sky-50 text-sky-700",
    value: "customers",
  },
  {
    key: "today",
    title: "طلبات اليوم",
    icon: ShoppingBag,
    iconClass: "border-amber-200 bg-amber-50 text-amber-700",
    value: "todayOrders",
  },
  {
    key: "upcoming",
    title: "الطلبات القادمة",
    icon: Calendar,
    iconClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    value: "upcomingOrders",
  },
] as const;

export default function DashboardStatsCards(props: DashboardStatsCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {cards.map(({ key, title, icon: Icon, iconClass, value }) => (
        <article
          key={key}
          className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-5"
        >
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-lg border ${iconClass}`}
          >
            <Icon className="size-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 sm:text-sm">
              {title}
            </p>
            <p className="mt-0.5 text-2xl font-extrabold text-slate-900 num-tabular">
              {props[value]}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
