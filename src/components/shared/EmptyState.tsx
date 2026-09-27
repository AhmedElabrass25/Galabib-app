import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon = <PackageOpen className="w-12 h-12 text-slate-400" />,
  title,
  description,
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  const btnLabel = actionLabel || action?.label;
  const btnOnClick = onAction || action?.onClick;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4 my-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
        {icon}
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {description && <p className="text-sm font-semibold text-slate-500">{description}</p>}
      </div>
      {btnLabel && btnOnClick && (
        <button
          onClick={btnOnClick}
          className="mt-2 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base px-6 py-3 rounded-xl transition-all shadow-2xs min-h-[50px] cursor-pointer"
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
}
