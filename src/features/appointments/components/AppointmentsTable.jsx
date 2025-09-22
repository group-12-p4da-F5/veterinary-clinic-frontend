import AppointmentStatusBadge from "./AppointmentStatusBadge";

/**
 * props:
 *  - rows: Array<{ id, date, time, petName, type, reason, status: "pending"|"attended"|"past" }>
 *  - onRowClick?: (row) => void
 */
export default function AppointmentsTable({ rows = [], onRowClick }) {
  const hasRows = rows.length > 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray bg-white shadow-sm">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-dark text-white">
          <tr>
            <th className="py-3 pl-4 text-left">Fecha</th>
            <th className="py-3 text-left">Hora</th>
            <th className="py-3 text-left">Mascota</th>
            <th className="py-3 text-left">Tipo</th>
            <th className="py-3 text-left">Motivo</th>
            <th className="py-3 pr-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {!hasRows ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-dark">
                No hay citas para mostrar.
              </td>
            </tr>
          ) : (
            rows.map((a, idx) => (
              <tr
                key={a.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-light/30" : "bg-white"
                } hover:bg-green-light/60 cursor-default transition-colors`}
                onClick={onRowClick ? () => onRowClick(a) : undefined}
              >
                <td className="py-3 pl-4">{a.date}</td>
                <td className="py-3">{a.time}</td>
                <td className="py-3">{a.petName}</td>
                <td className="py-3">{a.type}</td>
                <td className="py-3">{a.reason}</td>
                <td className="py-3 pr-4">
                  <AppointmentStatusBadge value={a.status} /> 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
