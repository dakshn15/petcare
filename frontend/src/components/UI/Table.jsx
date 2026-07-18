import React from 'react';

export default function Table({
  headers,
  loading,
  data = [],
  emptyMessage = 'No entries found.',
  renderRow,
  page,
  totalPages,
  onPageChange
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
              {headers.map((h, i) => (
                <th key={i} className={`p-4 ${h.className || 'text-start'}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center text-gray-400">
                  <div className="flex justify-center items-center gap-2">
                    <i className="fas fa-spinner animate-spin text-primary"></i> Loading entries...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="p-8 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, idx) => renderRow(item, idx))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-between items-center p-4 border-t border-gray-100 bg-white">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="px-3 py-1 bg-gray-100 text-gray-500 font-bold rounded-lg text-xs hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            className="px-3 py-1 bg-gray-100 text-gray-500 font-bold rounded-lg text-xs hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
