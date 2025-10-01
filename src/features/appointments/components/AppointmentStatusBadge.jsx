export default function AppointmentStatusBadge({ value }) {
  const colorByStatus = {
    PENDING: "bg-orange text-white",
    ATTENDED: "bg-green-dark text-white",
    MISSED: "bg-gray text-white",
  };

  const labelByStatus = {
    PENDING: "Pendiente",
    ATTENDED: "Atendido",
    MISSED: "No asistido",
  };

  const v = (value ?? "").toString().trim().toUpperCase();
  const cls = colorByStatus[v] ?? "bg-gray text-gray-dark";
  const label = labelByStatus[v] ?? "—";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}