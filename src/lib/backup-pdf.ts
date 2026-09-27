import type { BackupData } from "@/types";
import {
  getGarmentConfig,
  FIELD_LABEL_TRANSLATIONS,
} from "@/config/garment-types";
import { GARMENT_TYPE_LABELS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/date-utils";

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );

function renderOrder(order: BackupData["orders"][number], backup: BackupData) {
  const measurements = backup.measurements.filter(
    (item) => item.order_id === order.id,
  );
  const options = backup.order_options.filter(
    (item) => item.order_id === order.id,
  );
  const config = getGarmentConfig(order.garment_type);
  const fields =
    config?.measurements.concat(
      ...(config.options ?? []).flatMap(
        (option) => option.conditionalFields?.fields ?? [],
      ),
    ) ?? [];
  const measurementCards = measurements
    .map((item) => {
      const label =
        fields.find((field) => field.name === item.field_name)?.label ||
        FIELD_LABEL_TRANSLATIONS[item.field_name] ||
        item.field_name;
      return `<span class="measure"><b>${escapeHtml(label)}</b><br>${escapeHtml(item.value)} ${item.unit === "cm" ? "سم" : "إنش"}</span>`;
    })
    .join("");
  const optionLabels = options
    .map((item) => {
      const option = config?.options?.find(
        (entry) => entry.name === item.option_name,
      );
      const value = option?.options.find(
        (entry) => entry.value === item.option_value,
      );
      return `<span class="measure"><b>${escapeHtml(option?.label || item.option_name)}</b><br>${escapeHtml(value?.label || item.option_value)}</span>`;
    })
    .join("");
  return `<article class="order"><header><b>${escapeHtml(GARMENT_TYPE_LABELS[order.garment_type])}</b><span>${escapeHtml(ORDER_STATUS_LABELS[order.status])}</span></header><p>رقم الطلب: ${escapeHtml(order.id)} · تاريخ الطلب: ${escapeHtml(formatDate(order.created_at))} · آخر تحديث: ${escapeHtml(formatDate(order.updated_at))}</p><p>الكمية: ${order.quantity} · السداري: ${order.sadary_count} · التسليم: ${escapeHtml(formatDate(order.delivery_date))}</p>${order.notes ? `<p>ملاحظات الطلب: ${escapeHtml(order.notes)}</p>` : ""}<div class="values">${measurementCards}${optionLabels}</div></article>`;
}

export function downloadBackupPdf(backup: BackupData, target: Window) {
  const cards = backup.customers
    .map((customer) => {
      const orders = backup.orders.filter(
        (order) => order.customer_id === customer.id,
      );
      return `<article class="customer"><header class="brand"><div><small>ملف عميل · تفصيل الجلابيب</small><h1>${escapeHtml(customer.name)}</h1></div><b>${orders.length} طلبات</b></header><section class="profile"><div><small>رقم العميل</small><strong>${escapeHtml(customer.id)}</strong></div><div><small>رقم الهاتف</small><strong dir="ltr">${escapeHtml(customer.phone)}</strong></div><div><small>تاريخ التسجيل</small><strong>${escapeHtml(formatDate(customer.created_at))}</strong></div><div class="notes"><small>ملاحظات العميل</small><strong>${escapeHtml(customer.notes || "لا توجد ملاحظات")}</strong></div></section><h2>سجل الطلبات والمقاسات</h2>${orders.length ? orders.map((order) => renderOrder(order, backup)).join("") : "<p>لا توجد طلبات مسجلة لهذا العميل.</p>"}<footer>نسخة احتياطية · ${escapeHtml(formatDate(backup.created_at))}</footer></article>`;
    })
    .join("");
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>بطاقات العملاء</title><style>@page{size:A4;margin:12mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#172521;background:#f4f6f3;margin:0}.customer{break-after:page;background:#fff;border:1px solid #dce5df;border-radius:12px;padding:24px;margin:0 auto 20px;max-width:760px}.customer:last-child{break-after:auto}.brand{display:flex;align-items:center;justify-content:space-between;background:#142b27;color:#fff;border-radius:9px;padding:18px 22px}.brand small{color:#a7f3d0}.brand h1{font-size:24px;margin:6px 0 0}.brand>b{background:#ffffff1a;border-radius:7px;padding:8px 12px}.profile{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}.profile>div{background:#f5f7f4;border-radius:7px;padding:12px}.profile .notes{grid-column:span 2;background:#fff;border:1px solid #dce5df}.profile small{display:block;color:#718079;font-size:11px;margin-bottom:5px}.profile strong{font-size:13px}.customer h2{font-size:17px;border-bottom:2px solid #176b59;padding-bottom:8px}.order{break-inside:avoid;border:1px solid #dce5df;border-radius:8px;padding:13px;margin:10px 0}.order header{display:flex;justify-content:space-between;gap:12px}.order header span{color:#176b59;font-weight:bold}.order p{font-size:12px;color:#53635d;margin:8px 0}.values{display:flex;flex-wrap:wrap;gap:6px}.measure{font-size:11px;background:#e8f4ef;border-radius:5px;padding:6px 8px}.customer footer{border-top:1px solid #dce5df;margin-top:14px;padding-top:8px;color:#718079;font-size:10px}</style></head><body>${cards || "<p>لا توجد بيانات عملاء للتصدير.</p>"}<script>window.onload=()=>{window.focus();window.print()}</script></body></html>`;
  target.document.title = `بطاقات العملاء - ${new Date().toLocaleDateString("ar-EG")}`;
  let printed = false;
  const print = () => {
    if (printed || target.closed) return;
    printed = true;
    target.focus();
    target.print();
  };
  target.onload = print;
  target.document.open();
  target.document.write(html);
  target.document.close();
  target.setTimeout(print, 300);
}
