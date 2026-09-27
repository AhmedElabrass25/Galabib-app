import type { BackupData } from "@/types";
import { GARMENT_TYPE_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";

export function orderSheet(backup: BackupData) {
  const customers = new Map(
    backup.customers.map((customer) => [customer.id, customer]),
  );
  return {
    sheet: "الطلبات",
    data: [
      [
        "رقم الطلب",
        "العميل",
        "رقم العميل",
        "الهاتف",
        "النوع",
        "الكمية",
        "السداري",
        "التسليم",
        "الحالة",
        "ملاحظات",
        "تاريخ الإنشاء",
        "آخر تحديث",
      ],
      ...backup.orders.map((order) => {
        const customer = customers.get(order.customer_id);
        return [
          order.id,
          customer?.name ?? "",
          order.customer_id,
          customer?.phone ?? "",
          GARMENT_TYPE_LABELS[order.garment_type],
          order.quantity,
          order.sadary_count,
          order.delivery_date,
          ORDER_STATUS_LABELS[order.status],
          order.notes ?? "",
          order.created_at,
          order.updated_at,
        ];
      }),
    ],
  };
}
