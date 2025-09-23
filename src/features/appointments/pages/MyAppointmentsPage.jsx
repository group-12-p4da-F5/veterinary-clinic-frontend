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

/* 
===========================================================
Resumen — MyAppointmentsPage (orquestador de “Mis citas”)
===========================================================
1) Rol de la página
   - Esta página orquesta la vista: maneja el filtro de estado, selecciona qué filas mostrar y
     delega el render de la tabla a <AppointmentsTable />.
   - No hace fetch aún: usa MOCK_ROWS para validar UI y flujo antes de conectar con la API.

2) Datos MOCK (temporales)
   - MOCK_ROWS simula la respuesta ya formateada para la vista:
       { id, date(DD/MM/YYYY), time(HH:mm), petName, type, reason, status }
   
3) Filtro de estado (controlado)
   - state local: `status` ("all" por defecto) controla el <select>.
   - STATUSES define valores internos (value EN) y etiquetas visibles (label ES).
   - Cambio en el select → setStatus(...) → recalcula las filas visibles.

4) Optimización (useMemo)
   - `filteredRows` memoiza el resultado del filtrado en función de `status`.
   - Si `status` no cambia, no se recalcula el filtrado → evita renders de la tabla innecesarios.
   - En producción (con paginación/servidor) este filtrado podría delegarse a la API.

5) Render de UI (mobile-first con Tailwind)
   - Contenedor principal con paddings y max-width para layout fluido.
   - Sección de filtros: label + select (listo para añadir más filtros en el futuro).
   - Sección de tabla: delegada a <AppointmentsTable rows={filteredRows} />.
  

6) Separación de responsabilidades
   - Página: estado de filtro, (en el futuro) lectura/escritura del query param (?status=),
     orquestación y composición de componentes.
   - Tabla (<AppointmentsTable>): componente de presentación; no contiene lógica de filtro.
   - Badge (<AppointmentStatusBadge>): encapsula color y etiqueta según `status`.

7) Extensiones futuras (TODO)
   - Reemplazar MOCK_ROWS por hook/servicio real:
       - GET /api/appointments/mine?status=pending|attended|past&page=0&size=10
       - Mapear { startAt, pet.name, ... } → { date, time, petName, ... } en un util (mapApiToView).
   - Sincronizar filtro con URL:
       - Leer inicial desde `new URLSearchParams(location.search)`.
       - Actualizar con `setSearchParams({ status })` para compartir estado por enlace.
   - Manejo de estados: loading, error, empty (placeholder UX).
   - Paginación/sort: decidir si es cliente o servidor y añadir controles.

8) Depuración rápida
   - Si “no aparece nada”, revisar que la ruta hija exista (ej. "/mis-citas"), que el Layout tenga <Outlet />,
     y que el import/export de MyAppointmentsPage sea correcto (export default).
*/

