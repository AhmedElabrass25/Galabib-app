import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'حدث خطأ أثناء تحميل البيانات',
  message = 'يرجى التأكد من اتصال الإنترنت أو المحاولة مرة أخرى.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-rose-50/60 border border-rose-200 rounded-2xl shadow-2xs space-y-4 my-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-xl font-bold text-rose-950">{title}</h3>
        <p className="text-sm font-semibold text-rose-800/80">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-base px-5 py-2.5 rounded-xl transition-all shadow-2xs min-h-[48px] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
