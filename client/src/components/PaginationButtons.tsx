import type { PaginationMeta } from "../types/pagination"

type PaginationButtonsProps = {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: Array<number | "..."> = []

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  pages.push(1)

  if (currentPage > 4) {
    pages.push("...")
  }

  const startPage = Math.max(2, currentPage - 1)
  const endPage = Math.min(totalPages - 1, currentPage + 1)

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page)
  }

  if (currentPage < totalPages - 3) {
    pages.push("...")
  }

  pages.push(totalPages)

  return pages
}

export function PaginationButtons({
  pagination,
  onPageChange,
}: PaginationButtonsProps) {
  if (pagination.totalPages <= 1) return null

  const pages = getPageNumbers(pagination.page, pagination.totalPages)

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
        className="rounded bg-stone-100 px-3 py-2 text-sm text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-stone-500"
            >
              ...
            </span>
          )
        }

        const isActive = page === pagination.page

        return (
          <button
            key={page}
            type="button"
            disabled={isActive}
            onClick={() => onPageChange(page)}
            className={`rounded px-3 py-2 text-sm ${
              isActive
                ? "bg-stone-900 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
        className="rounded bg-stone-100 px-3 py-2 text-sm text-stone-700 hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
