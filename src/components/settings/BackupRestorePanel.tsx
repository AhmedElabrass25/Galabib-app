import { useRef, useState } from "react";
import { ShieldAlert, Upload } from "lucide-react";
import { toast } from "sonner";
import type { BackupData } from "@/types";
import { restoreBackup, validateBackupStructure } from "@/lib/backup";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function BackupRestorePanel() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [backup, setBackup] = useState<BackupData | null>(null);
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data: unknown = JSON.parse(await file.text());
      if (!validateBackupStructure(data))
        throw new Error("ملف النسخة الاحتياطية غير صالح أو تالف");
      setBackup(data);
      setPhrase("");
      setError("");
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "فشل في قراءة ملف JSON",
      );
      event.target.value = "";
    }
  };
  const confirmRestore = async () => {
    if (!backup) return;
    if (phrase.trim() !== "استعادة")
      return setError('اكتب كلمة "استعادة" للتأكيد');
    setLoading(true);
    try {
      await restoreBackup(backup);
      toast.success("تم استعادة البيانات بنجاح");
      window.location.assign("/");
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "تعذر استعادة البيانات",
      );
      setLoading(false);
    }
  };
  const close = () => {
    setBackup(null);
    setPhrase("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Upload className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              استعادة نسخة احتياطية
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              اختر ملف JSON لاستبدال البيانات الحالية.
            </p>
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
              <ShieldAlert className="size-4 shrink-0" />
              الاستعادة تستبدل جميع البيانات الحالية.
            </p>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".json,application/json"
          onChange={selectFile}
          className="hidden"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-700 px-5 text-sm font-bold text-white hover:bg-amber-800"
          >
            <Upload className="size-4" />
            اختر ملف JSON
          </button>
        </div>
      </section>
      <ConfirmDialog
        isOpen={!!backup}
        onClose={close}
        onConfirm={() => void confirmRestore()}
        title="تأكيد استعادة النسخة"
        description={`الملف يحتوي ${backup?.customers.length ?? 0} عميل و${backup?.orders.length ?? 0} طلب. اكتب كلمة استعادة للتأكيد.`}
        confirmText="استعادة البيانات"
        variant="danger"
        isLoading={loading}
      >
        <label className="block space-y-1.5 text-sm font-bold text-slate-700">
          كلمة التأكيد
          <input
            value={phrase}
            onChange={(event) => {
              setPhrase(event.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base outline-none focus:border-primary"
          />
          {error && (
            <span role="alert" className="block text-xs text-rose-700">
              {error}
            </span>
          )}
        </label>
      </ConfirmDialog>
    </>
  );
}
