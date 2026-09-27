import { useEffect, useMemo, useState } from "react";

export default function usePagination<T>(
  items: T[],
  resetKey = "",
  pageSize = 6,
) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize],
  );
  useEffect(() => setPage(1), [resetKey]);
  return {
    page: currentPage,
    pageCount,
    total: items.length,
    visibleItems,
    setPage,
  };
}
