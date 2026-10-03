import type { BackupData, Measurement } from "@/types";
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

function renderMeasurementCards(
  measurements: Measurement[],
  fields: NonNullable<ReturnType<typeof getGarmentConfig>>["measurements"],
) {
  const independentNames = new Set(
    fields
      .filter((field) => field.unit === "cm_and_inch_independent")
      .map((field) => field.name),
  );
  const byName = new Map(
    measurements.map((measurement) => [measurement.field_name, measurement]),
  );
  const rendered = new Set<string>();
  const cards: string[] = [];

  for (const measurement of measurements) {
    const isInchValue = measurement.field_name.endsWith("_inch");
    const baseName = isInchValue
      ? measurement.field_name.slice(0, -"_inch".length)
      : measurement.field_name;

    if (independentNames.has(baseName)) {
      if (rendered.has(baseName)) continue;
      rendered.add(baseName);
      rendered.add(`${baseName}_inch`);
      const values = [
        byName.get(baseName),
        byName.get(`${baseName}_inch`),
      ].filter((value): value is Measurement => value !== undefined);
      const label =
        fields.find((field) => field.name === baseName)?.label || baseName;
      const formattedValues = values
        .map(
          (value) =>
            `<span class="measure-value">${escapeHtml(value.value)} ${value.unit === "cm" ? "سم" : "إنش"}</span>`,
        )
        .join("");
      cards.push(
        `<div class="measure"><b>${escapeHtml(label)}</b><div class="measure-values">${formattedValues}</div></div>`,
      );
      continue;
    }

    const label =
      fields.find((field) => field.name === measurement.field_name)?.label ||
      FIELD_LABEL_TRANSLATIONS[measurement.field_name] ||
      measurement.field_name;
    const isTextMeasurement =
      measurement.notes &&
      measurement.notes.length > 0 &&
      Number(measurement.value) === 0;
    const value = isTextMeasurement
      ? measurement.notes
      : `${measurement.value} ${measurement.unit === "cm" ? "سم" : "إنش"}`;
    cards.push(
      `<div class="measure"><b>${escapeHtml(label)}</b><span class="measure-value">${escapeHtml(value)}</span></div>`,
    );
  }

  return cards.join("");
}

function renderOrder(order: BackupData["orders"][number], backup: BackupData) {
  const measurements = backup.measurements.filter(
    (item) => item.order_id === order.id,
  );
  const options = backup.order_options.filter(
    (item) => item.order_id === order.id,
  );
  const config = getGarmentConfig(order.garment_type);
  const fields = [
    ...(config?.measurements ?? []),
    ...(config?.options?.flatMap(
      (option) => option.conditionalFields?.fields ?? [],
    ) ?? []),
  ];
  const measurementCards = renderMeasurementCards(measurements, fields);
  const optionCards = options
    .map((item) => {
      const option = config?.options?.find(
        (entry) => entry.name === item.option_name,
      );
      const value = option?.options.find(
        (entry) => entry.value === item.option_value,
      );
      return `<div class="measure"><b>${escapeHtml(option?.label || item.option_name)}</b><span class="measure-value">${escapeHtml(value?.label || item.option_value)}</span></div>`;
    })
    .join("");

  return `<section class="order"><header class="order-heading"><h2>${escapeHtml(GARMENT_TYPE_LABELS[order.garment_type])}</h2><span>${escapeHtml(ORDER_STATUS_LABELS[order.status])}</span></header><div class="order-meta"><div><b>تاريخ الطلب</b><span>${escapeHtml(formatDate(order.created_at))}</span></div><div><b>عدد الجلاليب</b><span>${escapeHtml(order.quantity)}</span></div><div><b>عدد السداري</b><span>${escapeHtml(order.sadary_count)}</span></div><div><b>موعد التسليم</b><span>${escapeHtml(formatDate(order.delivery_date))}</span></div></div>${order.notes ? `<div class="notes"><b>ملاحظات الطلب</b><p>${escapeHtml(order.notes)}</p></div>` : ""}<h3>المقاسات والتفاصيل</h3><div class="values">${measurementCards}${optionCards}</div></section>`;
}

function renderCustomerPage(
  customer: BackupData["customers"][number],
  orders: BackupData["orders"],
  backup: BackupData,
) {
  const orderContent = orders.length
    ? orders.map((order) => renderOrder(order, backup)).join("")
    : `<p class="empty">لا توجد طلبات مسجلة لهذا العميل.</p>`;
  return `<article class="customer-page"><header class="brand"><div><small>بطاقة العميل</small><h1>${escapeHtml(customer.name)}</h1></div><strong dir="ltr">${escapeHtml(customer.phone)}</strong></header>${customer.notes ? `<section class="notes customer-notes"><b>ملاحظات العميل</b><p>${escapeHtml(customer.notes)}</p></section>` : ""}${orderContent}</article>`;
}

export function downloadBackupPdf(backup: BackupData, target: Window) {
  const pages = backup.customers
    .flatMap((customer) => {
      const orders = backup.orders.filter(
        (order) => order.customer_id === customer.id,
      );
      return [renderCustomerPage(customer, orders, backup)];
    })
    .join("");
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>بطاقات العملاء</title><style>
@page{size:A4 portrait;margin:8mm}
*{box-sizing:border-box;color:#000!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;font-size:14pt;line-height:1.35}
.customer-page{width:100%;break-after:page;page-break-after:always;break-inside:avoid;page-break-inside:avoid;display:flex;flex-direction:column;gap:3mm}
.customer-page:last-child{break-after:auto;page-break-after:auto}
.brand{border:2px solid #000;padding:3mm 4mm;display:flex;align-items:center;justify-content:space-between;gap:4mm}
.brand small{display:block;font-size:13pt;font-weight:700}
.brand h1{font-size:26pt;line-height:1.15;margin:1mm 0 0;font-weight:900;overflow-wrap:anywhere}
.profile{display:grid;grid-template-columns:1fr 1fr;gap:2mm}
.profile>div,.order-meta>div{border:1.5px solid #000;padding:3mm;min-width:0}
.profile b,.order-meta b,.notes>b{display:block;font-size:13pt;font-weight:800;margin-bottom:1mm}
.profile strong,.order-meta span{display:block;font-size:17pt;font-weight:900;overflow-wrap:anywhere}
.profile .notes{grid-column:span 2}
.customer-notes{padding:2.5mm}
.notes{border:2px solid #000;padding:3mm;font-size:15pt;font-weight:700}
.notes p{white-space:pre-wrap;overflow-wrap:anywhere;margin:1mm 0 0;font-size:16pt;font-weight:800;line-height:1.4}
.order{border:2px solid #000;padding:3mm;break-inside:avoid;page-break-inside:avoid}
.order+.order{margin-top:1mm}
.order-heading{display:flex;align-items:baseline;justify-content:space-between;gap:4mm;border-bottom:2px solid #000;padding-bottom:2mm}
.order-heading h2{font-size:22pt;font-weight:900;margin:0}
.order-heading span{font-size:15pt;font-weight:800;white-space:nowrap}
.order-meta{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2mm;margin:2mm 0}
.order-meta>div{padding:2mm}
.order-meta b{font-size:11pt}
.order-meta span{font-size:14pt}
.order h3{font-size:17pt;font-weight:900;margin:3mm 0 2mm;border-bottom:1.5px solid #000;padding-bottom:1.5mm}
.values{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:2mm}
.measure{border:1.5px solid #000;min-width:0;min-height:17mm;padding:2mm;display:flex;flex-direction:column;justify-content:center;gap:1mm;break-inside:avoid;page-break-inside:avoid}
.measure b{font-size:12pt;font-weight:800;overflow-wrap:anywhere}
.measure-value{font-size:17pt;font-weight:900;overflow-wrap:anywhere}
.measure-values{display:flex;flex-wrap:wrap;justify-content:space-between;gap:1mm}
.measure-values .measure-value{font-size:15pt}
.empty{font-size:17pt;font-weight:800}
@media screen{body{padding:8mm;background:#eee}.customer-page{max-width:194mm;min-height:281mm;margin:0 auto 8mm;padding:6mm;background:#fff;border:1px solid #000}}
</style></head><body>${pages || "<p>لا توجد بيانات عملاء للتصدير.</p>"}</body></html>`;
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
