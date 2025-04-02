export default function Pagination({
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const pages = [];
  // Create array of page numbers to display (show up to 5 pages)
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &laquo;
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &lsaquo;
      </button>

      {startPage > 1 && <span className="px-3 py-1">...</span>}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? 'bg-blue-500 hover:bg-primaryhover text-white text-sm'
              : ''
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && <span className="px-3 py-1">...</span>}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &rsaquo;
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
}
