interface LoadingStateProps {
  message?: string;
  variant?: "dashboard" | "customers" | "orders" | "form" | "detail";
}

export default function LoadingState({
  message = "جاري التحميل...",
  variant = "orders",
}: LoadingStateProps) {
  const count =
    variant === "customers"
      ? 6
      : variant === "orders"
        ? 6
        : variant === "dashboard"
          ? 3
          : 2;
  const isGrid = variant === "customers" || variant === "dashboard";
  const showStats = variant === "dashboard";
  return (
    <div
      role="status"
      aria-busy="true"
      className="animate-pulse space-y-6 py-2"
    >
      <span className="sr-only">{message}</span>
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
      {showStats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="h-24 rounded-lg border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}
      {variant === "form" &&
        Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
          >
            <div className="h-6 w-48 rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, field) => (
                <div key={field} className="h-12 rounded-md bg-slate-100" />
              ))}
            </div>
          </div>
        ))}
      {variant === "detail" && (
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
          <div className="h-8 w-56 rounded bg-slate-200" />
          <div className="h-16 rounded bg-slate-100" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-16 rounded bg-slate-100" />
            ))}
          </div>
          <div className="h-40 rounded bg-slate-100" />
        </div>
      )}
      <div
        className={
          isGrid
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "space-y-3"
        }
      >
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className={
              isGrid
                ? "h-48 rounded-lg border border-slate-200 bg-white"
                : "h-24 rounded-lg border border-slate-200 bg-white"
            }
          />
        ))}
      </div>
      <p className="text-center text-xs font-semibold text-slate-500">
        {message}
      </p>
    </div>
  );
}
