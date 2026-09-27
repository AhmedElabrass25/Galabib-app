import { useState } from "react";
import { Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { createBackup, downloadBackup } from "@/lib/backup";
import { downloadBackupExcel } from "@/lib/backup-excel";
import { downloadBackupPdf } from "@/lib/backup-pdf";

type ExportFormat = "json" | "excel" | "pdf";

export default function BackupExportPanel() {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const exportData = async (format: ExportFormat) => {
    const pdfWindow =
      format === "pdf" ? window.open("about:blank", "_blank") : null;
    if (format === "pdf" && !pdfWindow) {
      toast.error("اسمح بفتح النوافذ المنبثقة لحفظ PDF");
      return;
    }
    setExporting(format);
    try {
      const backup = await createBackup();
      if (format === "json") downloadBackup(backup);
      if (format === "excel") await downloadBackupExcel(backup);
      if (format === "pdf") downloadBackupPdf(backup, pdfWindow!);
      toast.success(
        format === "pdf"
          ? "اختر حفظ كـ PDF من نافذة الطباعة"
          : "تم تنزيل النسخة الاحتياطية بنجاح",
      );
    } catch (error) {
      pdfWindow?.close();
      toast.error(
        error instanceof Error ? error.message : "تعذر إنشاء النسخة الاحتياطية",
      );
    } finally {
      setExporting(null);
    }
  };
  const buttons = [
    {
      format: "excel" as const,
      label: "Excel (.xlsx)",
      icon: FileSpreadsheet,
      style: "bg-primary text-white hover:bg-primary-dark",
    },
    {
      format: "pdf" as const,
      label: "PDF بطاقات العملاء",
      icon: FileText,
      style: "bg-[#a9482d] text-white hover:bg-[#913d27]",
    },
    {
      format: "json" as const,
      label: "JSON",
      icon: Download,
      style:
        "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
    },
  ];
  return (
    <section className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-primary">
          <Download className="size-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            تصدير نسخة احتياطية
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Excel بأوراق للعملاء والطلبات والمقاسات، أو PDF منسق ببطاقة مستقلة
            لكل عميل.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {buttons.map(({ format, label, icon: Icon, style }) => (
          <button
            key={format}
            type="button"
            onClick={() => void exportData(format)}
            disabled={!!exporting}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-bold shadow-sm disabled:opacity-50 ${style}`}
          >
            {exporting === format ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Icon className="size-4" />
            )}
            {exporting === format ? "جاري التجهيز..." : label}
          </button>
        ))}
      </div>
    </section>
  );
}
