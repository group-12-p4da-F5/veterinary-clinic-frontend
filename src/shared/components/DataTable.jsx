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
          {/* Loading state (skeleton) */}
          {loading &&
            [...Array(3)].map((_, r) => (
              <tr
                key={`loading-${r}`}
                className={zebra && r % 2 === 0 ? "bg-green-light/30" : "bg-white"}
              >
                {columns.map((_, c) => (
                  <td key={`loading-${r}-${c}`} className={`py-3 ${c === 0 ? "pl-4" : ""}`}>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray/70" />
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty state */}
          {!loading && !hasRows && (
            <tr>
              <td colSpan={colCount} className="p-4 text-center text-gray-dark">
                {emptyMessage}
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading &&
            hasRows &&
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
            })}
        </tbody>
      </table>
    </div>
  );
}
