import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
      <div className="min-w-0">
        <span className="block w-8 h-1 bg-secondary rounded-full mb-3" />
        <h1 className="text-[25px] sm:text-[29px] leading-tight font-extrabold text-text-primary">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-sm mt-1.5 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 w-full sm:w-auto [&>*]:max-sm:w-full [&>*]:max-sm:justify-center">
          {action}
        </div>
      )}
    </div>
  );
}
