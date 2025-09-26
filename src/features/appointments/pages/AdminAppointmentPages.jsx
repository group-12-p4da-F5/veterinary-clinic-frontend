import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";            
import DataTable from "../../../shared/components/DataTable";
import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import { getAllAppointments } from "../services/appointmentService";

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //estado del filtro (paciente/dueño)
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getAllAppointments(); //reemplazar por fetch real cuando esté
        if (alive) setRows(data);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  //filtrado local por paciente (petName) o dueño (ownerName), case-insensitive
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      [r.petName, r.ownerName].filter(Boolean).some(v => v.toLowerCase().includes(term))
    );
  }, [q, rows]);

  const columns = [
    { key: "date",    header: "Fecha" },
    { key: "time",    header: "Hora" },
    { key: "petName", header: "Paciente" },
    { key: "ownerName", header: "Dueño", cell: (r) => r.ownerName ?? "—" },
    { key: "type",    header: "Tipo" },
    { key: "reason",  header: "Motivo" },
    {
      key: "status",
      header: "Estado",
      cell: (r) => <AppointmentStatusBadge value={r.status} />,
    },
    // columna de acciones (Editar)
    {
      key: "actions",
      header: "Acciones",
      cell: (r) => (
        <Link
          to={`/editar-cita`}
          state={{ appointment: r, fromAdmin:true }} //pasamos la cita por state para que EditAppointmentPage la reciba
          className="rounded-md bg-orange px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          Editar
        </Link>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Citas (administrador)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Listado general de citas registradas.
        </p>
      </header>

      {/*filtro por paciente/dueño */}
      <section aria-label="Filtros" className="mb-4">
        <label htmlFor="appt-filter" className="mb-1 block text-sm font-medium">
          Filtrar por paciente o dueño
        </label>
        <input
          id="appt-filter"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ej. Cookie, Ana García…"
          className="w-full rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
        />
      </section>

      {error && (
        <div className="mb-4 rounded-lg border border-orange/40 bg-orange/10 p-3" role="alert">
          <p className="text-sm font-medium text-orange">
            No se pudieron cargar las citas.
          </p>
          <p className="mt-1 text-xs text-gray-dark">
            {error?.message || "Error de red o del servidor"}
          </p>
        </div>
      )}

      <section aria-label="Citas (admin)">
        <DataTable
          columns={columns}
          rows={filtered}                
          loading={loading}
          emptyMessage={q ? "Sin resultados para tu búsqueda" : "No hay citas registradas"}
          testId="admin-appointments-table"
        />
      </section>
    </main>
  );
}
