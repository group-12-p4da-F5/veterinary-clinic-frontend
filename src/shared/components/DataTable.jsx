import React from "react";

/**
 *tabla reutilizable.
 *
 * Props:
 *  - columns: Array<{ key: string, header: React.ReactNode, cell?: (row) => React.ReactNode, className?: string }>
 *  - rows: any[]
 *  - getRowKey?: (row: any, index: number) => string | number   (default: row.id ?? index)
 *  - onRowClick?: (row: any) => void                             (adds hover + pointer)
 *  - loading?: boolean                                           (shows skeleton rows)
 *  - emptyMessage?: string                                       (shown when no rows and !loading)
 *  - zebra?: boolean                                             (default: true)
 *  - testId?: string
 */
export default function DataTable({
  columns = [],
  rows = [],
  getRowKey = (row, i) => row?.id ?? i,
  onRowClick,
  loading = false,
  emptyMessage = "No hay datos para mostrar.",
  zebra = true,
  testId,
}) {
  const colCount = columns.length;
  const hasRows = !loading && rows.length > 0;

    if (loading) {
    return (
      <div
        className="overflow-x-auto rounded-xl border border-gray bg-white p-6 shadow-sm"
        data-testid={testId}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex items-center justify-center gap-3">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-gray-600">Cargando…</span>
        </div>
      </div>
    );
  }

  // Render normal (sin loading): estado vacío o filas
  return (
    <div
      className="overflow-x-auto rounded-xl border border-gray bg-white shadow-sm"
      data-testid={testId}
    >
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-dark text-white">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key ?? idx}
                className={`py-3 ${idx === 0 ? "pl-4" : ""} text-left ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Empty state */}
          {!hasRows ? (
            <tr>
              <td colSpan={colCount} className="p-4 text-center text-gray-dark">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            /* Data rows */
            rows.map((row, idx) => {
              const rowCls = [
                zebra && idx % 2 === 0 ? "bg-green-light/30" : "bg-white",
                onRowClick ? "hover:bg-green-light/60 cursor-pointer transition-colors" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <tr
                  key={getRowKey(row, idx)}
                  className={rowCls}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col, cIdx) => (
                    <td key={col.key ?? cIdx} className={`py-3 ${cIdx === 0 ? "pl-4" : ""}`}>
                      {col.cell ? col.cell(row) : row?.[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
