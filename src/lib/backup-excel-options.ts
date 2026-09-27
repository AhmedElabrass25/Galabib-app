import type { BackupData } from "@/types";
import { GARMENT_TYPE_LABELS } from "@/lib/constants";
import { getGarmentConfig } from "@/config/garment-types";

export function optionSheet(backup: BackupData) {
  const customers = new Map(
    backup.customers.map((customer) => [customer.id, customer]),
  );
  const orders = new Map(backup.orders.map((order) => [order.id, order]));
  return {
    sheet: "الخيارات",
    data: [
      [
        "العميل",
        "رقم العميل",
        "الهاتف",
        "رقم الطلب",
        "رقم سجل الخيار",
        "نوع الجلابية",
        "الخيار",
        "القيمة",
        "تاريخ الإنشاء",
      ],
      ...backup.order_options.map((item) => {
        const order = orders.get(item.order_id);
        const customer = customers.get(order?.customer_id ?? "");
        const option = getGarmentConfig(
          order?.garment_type ?? "",
        )?.options?.find((entry) => entry.name === item.option_name);
        return [
          customer?.name ?? "",
          customer?.id ?? "",
          customer?.phone ?? "",
          item.order_id,
          item.id,
          order ? GARMENT_TYPE_LABELS[order.garment_type] : "",
          option?.label ?? item.option_name,
          option?.options.find((entry) => entry.value === item.option_value)
            ?.label ?? item.option_value,
          item.created_at,
        ];
      }),
    ],
  };
}
