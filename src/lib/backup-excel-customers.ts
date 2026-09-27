import type { BackupData } from "@/types";

export function customerSheet(backup: BackupData) {
  return {
    sheet: "العملاء",
    data: [
      [
        "رقم العميل",
        "الاسم",
        "الهاتف",
        "ملاحظات",
        "تاريخ التسجيل",
        "آخر تحديث",
      ],
      ...backup.customers.map((item) => [
        item.id,
        item.name,
        item.phone,
        item.notes ?? "",
        item.created_at,
        item.updated_at,
      ]),
    ],
  };
}
