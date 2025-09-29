import { useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import DataTable from "../../../shared/components/DataTable"
import AppointmentStatusBadge from "../components/AppointmentStatusBadge"
import SuccessDialog from "../../../shared/components/SuccessDialog"

const MOCK_ROWS = [
  {
    id: "1",
    date: "30/10/2025",
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

//util para parsear "DD/MM/YYYY HH:mm" a Date
function appointmentStartDate(a) {
  //a.date = "DD/MM/YYYY", a.time = "HH:mm"
  const [dd, mm, yyyy] = String(a.date).split("/")
  return new Date(`${yyyy}-${mm}-${dd}T${a.time}:00`) // segundos opcionales
}

// regla de edición (solo pendientes, y con >2h de margen)
function canEdit(appointment) {
  if ((appointment?.status ?? "").toLowerCase() !== "pending") return false
  const startAt = appointmentStartDate(appointment)
  const now = new Date()
  const MS_2H = 2 * 60 * 60 * 1000
  return startAt.getTime() - now.getTime() > MS_2H
}

export default function MyAppointmentsPage() {
  // Inicializa el hook 'useNavigate'
  const navigate = useNavigate()
  const [status, setStatus] = useState("all")

  //estado para mostrar mensajes amigables
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockMsg, setBlockMsg] = useState("")
  const [blockTitle] = useState("Edición no permitida") // título fijo reutilizable

  const filteredRows = useMemo(() => {
    if (status === "all") return MOCK_ROWS
    return MOCK_ROWS.filter((r) => r.status === status)
  }, [status])

  // EDIT: definición de columnas para DataTable (usamos el badge de estado)
  const columns = useMemo(() => ([
    { key: "date",    header: "Fecha" },
    { key: "time",    header: "Hora" },
    { key: "petName", header: "Paciente" },
    { key: "type",    header: "Tipo" },
    { key: "reason",  header: "Motivo" },
    { key: "status",  header: "Estado", cell: (r) => <AppointmentStatusBadge value={r.status} /> },
  ]), [])

  //Navega a la ruta de edición y pasa el objeto completo de la cita
  //aplicar guardas de negocio antes de navegar
  const handleRowClick = (appointment) => {
    if (!canEdit(appointment)) {
      // Mensaje claro de por qué no puede editar
      const isPending = (appointment?.status ?? "").toLowerCase() === "pending"
      const msg = isPending
        ? "No puedes editar la cita porque faltan 2 horas o menos para su inicio."
        : "Solo se pueden editar citas en estado Pendiente."
      setBlockMsg(msg)          // setear mensaje en el dialog
      setBlockOpen(true)        // abrir dialog
      return
    }
    navigate("/editar-cita", { state: { appointment } })
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      {/* diálogo reutilizable para mensajes de bloqueo */}
      <SuccessDialog
        open={blockOpen}
        title={blockTitle}
        message={blockMsg}
        actionLabel="Aceptar"
        onAction={() => setBlockOpen(false)}
        onClose={() => setBlockOpen(false)}
      />

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
        {/* Se pasa la función onRowClick a la tabla (con la regla aplicada) */}
        {/*  EDIT: pasamos también 'columns' que exige DataTable */}
        <DataTable
          columns={columns}
          rows={filteredRows}
          onRowClick={handleRowClick}
          emptyMessage="No hay citas para mostrar."
          loading={false}
          testId="appointments-table"
        />
      </section>
    </main>
  )
}
