import { CheckCircle2, Database } from "lucide-react";

const rows = [
  ["اللغة والواجهة:", "العربية (RTL)"],
  ["قاعدة البيانات:", "متصل بـ Supabase"],
  ["وحدات القياس:", "السنتيمتر (سم) / البوصة (إنش)"],
  ["أنواع الجلابيب:", "بلدي - أفرنجي - سعودي"],
];

export default function SystemInfoCard() {
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary">
        <Database className="size-5 text-primary" />
        حالة النظام وقاعدة البيانات
      </h2>
      <div className="grid grid-cols-1 gap-3 text-sm font-semibold sm:grid-cols-2">
        {rows.map(([label, value], index) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
          >
            <span className="text-text-secondary">{label}</span>
            <span
              className={`font-bold ${index === 1 ? "flex items-center gap-1 text-green-700" : "text-text-primary"}`}
            >
              {index === 1 && <CheckCircle2 className="size-4" />}
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
