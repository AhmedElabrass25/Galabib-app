import type { BackupData } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import {
  FIELD_LABEL_TRANSLATIONS,
  getGarmentConfig,
} from "@/config/garment-types";

export function measurementSheet(backup: BackupData) {
  const customers = new Map(
    backup.customers.map((customer) => [customer.id, customer]),
  );
  const orders = new Map(backup.orders.map((order) => [order.id, order]));
  return {
    sheet: "المقاسات",
    data: [
      [
        "العميل",
        "رقم العميل",
        "الهاتف",
        "رقم الطلب",
        "رقم سجل المقاس",
        "نوع الجلابية",
        "المقاس",
        "القيمة",
        "الوحدة",
        "ملاحظات",
        "تاريخ الإنشاء",
      ],
      ...backup.measurements.map((item) => {
        const order = orders.get(item.order_id);
        const customer = customers.get(order?.customer_id ?? "");
        const config = getGarmentConfig(order?.garment_type ?? "");
        const fields = [
          ...(config?.measurements ?? []),
          ...(config?.options?.flatMap(
            (option) => option.conditionalFields?.fields ?? [],
          ) ?? []),
        ];
        const label =
          fields.find((field) => field.name === item.field_name)?.label ??
          FIELD_LABEL_TRANSLATIONS[item.field_name] ??
          item.field_name;
        return [
          customer?.name ?? "",
          customer?.id ?? "",
          customer?.phone ?? "",
          item.order_id,
          item.id,
          order ? GARMENT_TYPE_LABELS[order.garment_type] : "",
          label,
          item.value,
          item.unit === "cm" ? "سم" : "إنش",
          item.notes ?? "",
          item.created_at,
        ];
      }),
    ],
  };
}
