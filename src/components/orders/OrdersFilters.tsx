import { Filter, Search } from "lucide-react";
import type { GarmentType, OrderStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrdersFiltersProps {
  search: string;
  status: OrderStatus | "";
  garment: GarmentType | "";
  onSearch: (value: string) => void;
  onStatus: (value: OrderStatus | "") => void;
  onGarment: (value: GarmentType | "") => void;
}

export default function OrdersFilters({
  search,
  status,
  garment,
  onSearch,
  onStatus,
  onGarment,
}: OrdersFiltersProps) {
  return (
    <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs md:flex-row">
      <div className="relative w-full md:max-w-xs">
        <input
          type="text"
          placeholder="ابحث باسم العميل أو رقم الهاتف..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2 ps-4 pe-10 text-sm font-semibold text-text-primary outline-hidden transition-all"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
      </div>
      <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-text-secondary">
          <Filter className="size-4 text-primary" />
          فلترة:
        </span>
        <Select
          value={status || "all"}
          onValueChange={(value) =>
            onStatus(value === "all" ? "" : (value as OrderStatus))
          }
        >
          <SelectTrigger className="w-full min-w-40 md:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="in_progress">جاري التنفيذ</SelectItem>
            <SelectItem value="ready">جاهز للتسليم</SelectItem>
            <SelectItem value="delivered">تم التسليم</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={garment || "all"}
          onValueChange={(value) =>
            onGarment(value === "all" ? "" : (value as GarmentType))
          }
        >
          <SelectTrigger className="w-full min-w-48 md:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع أنواع الجلابيب</SelectItem>
            <SelectItem value="balady">الجلابية البلدي</SelectItem>
            <SelectItem value="afrangy">الجلابية الأفرنجي العادي</SelectItem>
            <SelectItem value="saudi">الجلابية السعودي</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
