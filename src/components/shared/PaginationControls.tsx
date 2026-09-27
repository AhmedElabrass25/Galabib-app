import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  pageCount,
  total,
  onPageChange,
}: PaginationControlsProps) {
  if (pageCount <= 1) return null;
  const first = (page - 1) * 6 + 1;
  const last = Math.min(page * 6, total);
  return (
    <nav
      aria-label="التنقل بين الصفحات"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4"
    >
      <span className="text-sm font-medium text-slate-600">
        عرض {first}–{last} من {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ChevronRight className="size-4" />
          السابق
        </button>
        <span
          aria-current="page"
          className="min-w-14 text-center text-sm font-bold text-slate-700"
        >
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
        >
          التالي
          <ChevronLeft className="size-4" />
        </button>
      </div>
    </nav>
  );
}
