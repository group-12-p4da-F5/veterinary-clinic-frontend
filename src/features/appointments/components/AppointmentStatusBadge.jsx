export default function AppointmentStatusBadge({ value }) {
  const colorByStatus = {
    pending:  "bg-orange text-white",
    attended: "bg-green-dark text-gray-dark",
    past:     "bg-gray text-gray-dark",
  };

  const labelByStatus = {
    pending:  "Pendiente",
    attended: "Atendida",
    past:     "Pasada",
  };

  const v = (value ?? "").toString().trim().toLowerCase();
  const cls = colorByStatus[v] ?? "bg-gray text-gray-dark";   
  const label = labelByStatus[v] ?? "—";                      

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  );
}
