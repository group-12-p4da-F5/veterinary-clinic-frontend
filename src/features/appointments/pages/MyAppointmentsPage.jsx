import { useState, useMemo } from "react";
import AppointmentsTable from "../components/AppointmentsTable";

const MOCK_ROWS = [
  { id: "1", date: "30/08/2025", time: "10:00", petName: "Cookie", type: "Consulta",   reason: "Revisión anual", status: "pending"  },
  { id: "2", date: "20/02/2025", time: "12:30", petName: "Mila",   type: "Vacunación", reason: "Refuerzo",       status: "attended" },
  { id: "3", date: "25/11/2024", time: "09:15", petName: "Rocky",  type: "Urgencia",   reason: "Cojera",         status: "past"     },
];

const STATUSES = [
  { value: "all",      label: "Todos" },
  { value: "pending",  label: "Pendiente" },
  { value: "attended", label: "Atendida" },
  { value: "past",     label: "Pasada" },
];

export default function MyAppointmentsPage() {
  const [status, setStatus] = useState("all"); 

  const filteredRows = useMemo(() => {
    if (status === "all") return MOCK_ROWS;
    return MOCK_ROWS.filter(r => r.status === status); 
  }, [status]);

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" data-testid="appointments-title">
          Mis citas
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Revisa y organiza tus citas pasadas, pendientes y atendidas.
        </p>
      </header>

      <section aria-label="Filtros" className="mb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <select
            id="status"
            data-testid="status-filter"
            className="w-full rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section aria-label="Tabla de citas" className="rounded-xl border bg-white shadow-sm">
        <AppointmentsTable rows={filteredRows} />
      </section>
    </main>
  );
}

// useMemo es un Hook que sirve para optimizar el rendimiento al memorizar (caché).
// En lugar de volver a ejecutar la función que realiza el cálculo en cada renderizado, 
// useMemo devuelve el valor previamente calculado si las dependencias del cálculo no han cambiado, 
// evitando así recomputaciones innecesarias. 
