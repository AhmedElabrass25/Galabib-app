import { AlertTriangle, X } from "lucide-react";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  children?: ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد الحذف",
  cancelText = "إلغاء",
  variant = "danger",
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const buttonBg =
    variant === "danger"
      ? "bg-rose-600 hover:bg-rose-700 text-white"
      : variant === "warning"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : "bg-slate-900 hover:bg-slate-800 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-right">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          title="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`p-3.5 rounded-2xl shrink-0 ${
              variant === "danger"
                ? "bg-rose-100 text-rose-700 border border-rose-200"
                : variant === "warning"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : "bg-sky-100 text-sky-800 border border-sky-200"
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>

        <p className="text-slate-600 text-base leading-relaxed mb-6 font-semibold">
          {description}
        </p>
        {children && <div className="mb-5">{children}</div>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold hover:bg-slate-100 transition-colors disabled:opacity-50 min-h-[48px] cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-2xs active:scale-95 disabled:opacity-50 min-h-[48px] cursor-pointer ${buttonBg}`}
          >
            {isLoading ? "جاري التنفيذ..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
