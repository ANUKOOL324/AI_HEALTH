"use client";

import { useSearchParams } from "next/navigation";

interface MedicalShopsPaginationProps {
  currentPage: number;
  totalPages: number;
}

const buildPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);
};

export function MedicalShopsPagination({ currentPage, totalPages }: MedicalShopsPaginationProps) {
  const searchParams = useSearchParams();

  const createPageHref = (page: number) => {
    const query = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      query.set("page", String(page));
    } else {
      query.delete("page");
    }
    const queryString = query.toString();
    return queryString ? `/medical-shops?${queryString}` : "/medical-shops";
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={createPageHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Previous
      </a>

      {pages.map((page) => (
        <a
          key={page}
          href={createPageHref(page)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            page === currentPage
              ? "bg-[var(--primary)] text-white"
              : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
          }`}
        >
          {page}
        </a>
      ))}

      <a
        href={createPageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--primary)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Next
      </a>
    </div>
  );
}
