import type { GarmentType, OrderStatus, MeasurementFieldUnit } from "@/types";

// ===== Garment Type Labels =====
export const GARMENT_TYPE_LABELS: Record<GarmentType, string> = {
  balady: "الجلابية البلدي",
  afrangy: "الجلابية الأفرنجي العادي",
  saudi: "الجلابية السعودي",
};

// ===== Order Status =====
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  in_progress: "جاري التنفيذ",
  ready: "جاهز للتسليم",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-300",
  in_progress: "bg-blue-100 text-blue-900 border-blue-300",
  ready: "bg-emerald-100 text-emerald-900 border-emerald-300",
  delivered: "bg-slate-100 text-slate-700 border-slate-300",
  cancelled: "bg-red-100 text-red-900 border-red-300",
};

// ===== Unit Labels =====
export const UNIT_LABELS: Record<string, string> = {
  cm: "سم",
  inch: "إنش",
};

export const UNIT_LABEL_FOR_FIELD: Record<MeasurementFieldUnit, string> = {
  cm: "سم",
  inch: "إنش",
  cm_or_inch: "سم / إنش",
};

// ===== Sidebar Navigation =====
export const NAV_ITEMS = [
  { path: "/", label: "الرئيسية", icon: "LayoutDashboard" as const },
  { path: "/customers", label: "العملاء", icon: "Users" as const },
  { path: "/orders", label: "الطلبات", icon: "ClipboardList" as const },
  { path: "/showcase", label: "معرض المحل", icon: "Images" as const },
  { path: "/measurements", label: "المقاسات", icon: "Ruler" as const },
  { path: "/backup", label: "النسخ الاحتياطي", icon: "Database" as const },
];

export const BACKUP_VERSION = "1.0.0";
