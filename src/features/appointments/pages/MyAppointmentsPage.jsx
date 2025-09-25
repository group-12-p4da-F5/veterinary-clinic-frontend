import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import DataTable from "../../../shared/components/DataTable"
import AppointmentStatusBadge from "../components/AppointmentStatusBadge"

const MOCK_ROWS = [
  {
    id: "1",
    date: "30/08/2025",
    time: "10:00",
    petName: "Cookie",
    type: "Consulta",
    reason: "Revisión anual",
    status: "pending",
  },
  {
    id: "2",
    date: "20/02/2025",
    time: "12:30",
    petName: "Mila",
    type: "Vacunación",
    reason: "Refuerzo",
    status: "attended",
  },
  {
    id: "3",
    date: "25/11/2024",
    time: "09:15",
    petName: "Rocky",
    type: "Urgencia",
    reason: "Cojera",
    status: "past",
  },
]

const STATUSES = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "attended", label: "Atendida" },
  { value: "past", label: "Pasada" },
]

export default function MyAppointmentsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("all")

  const filteredRows = useMemo(() => {
    if (status === "all") return MOCK_ROWS
    return MOCK_ROWS.filter((r) => r.status === status)
  }, [status])

  const handleRowClick = (appointment) => {
    //Navega a la ruta de edición y pasa el objeto completo de la cita
    navigate("/editar-cita", { state: { appointment } })
  }

  // EDIT: columnas declarativas para DataTable (reutiliza el badge de estado)
  const columns = [
    { key: "date",    header: "Fecha" },
    { key: "time",    header: "Hora" },
    { key: "petName", header: "Mascota" },
    { key: "type",    header: "Tipo" },
    { key: "reason",  header: "Motivo" },
    { key: "status",  header: "Estado", cell: (row) => <AppointmentStatusBadge value={row.status} /> },
  ]

  return (
      <main className="mx-auto max-w-screen-xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" data-testid="appointments-title">
              Mis citas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Revisa y organiza tus citas pasadas, pendientes y atendidas.
            </p>
          </div>
          <Link
            to="/nueva-cita"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            + Agendar Cita
          </Link>
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
          {/* Se pasa la función onRowClick a la tabla */}
          <DataTable
            columns={columns}
            rows={filteredRows}
            onRowClick={handleRowClick}
            emptyMessage="No hay citas para mostrar."
            testId="appointments-table"
          />
        </section>
      </main>
  )
}
