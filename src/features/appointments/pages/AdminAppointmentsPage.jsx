import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentStatusBadge from "../components/AppointmentStatusBadge";
import {
  getAllAppointments,
  deleteAppointment,
  updateAppointmentStatus,
} from "../services/appointmentService";

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllAppointments();
      console.log("Appointments loaded:", data);

      const mapped = data.map((apt) => {
        const dt = new Date(apt.dateTime);
        const date = dt.toLocaleDateString("es-ES");
        const time = dt.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          appointmentId: apt.appointmentId,
          date,
          time,
          dateTime: apt.dateTime,
          petName: apt.patientId ? `Paciente #${apt.patientId}` : "—",
          patientId: apt.patientId,
          type: apt.type === "STANDARD" ? "Estándar" : "Emergencia",
          reason: apt.reason || "—",
          status: apt.status,
        };
      });

      setRows(mapped);
    } catch (e) {
      console.error("Error loading appointments:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let result = rows;

    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (term) {
      result = result.filter((r) =>
        [r.petName, r.reason, r.type]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(term))
      );
    }

    return result;
  }, [q, rows, statusFilter]);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      console.log("Updating status:", { appointmentId, newStatus });
      await updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments();
      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado: " + error.message);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
      return;
    }

    try {
      console.log("Deleting appointment:", appointmentId);
      await deleteAppointment(appointmentId);
      await loadAppointments();
      alert("Cita eliminada correctamente");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Error al eliminar la cita: " + error.message);
    }
  };

 const handleEdit = (appointmentId) => {
  console.log("Navigating to edit appointment:", appointmentId);
  const path = `/editar-cita/${appointmentId}`;  // ← CAMBIA ESTA LÍNEA
  console.log("Navigation path:", path);
  navigate(path);
};

  const columns = [
    { key: "date", header: "Fecha" },
    { key: "time", header: "Hora" },
    { key: "petName", header: "Paciente" },
    { key: "type", header: "Tipo" },
    { key: "reason", header: "Motivo" },
    {
      key: "status",
      header: "Estado",
      cell: (r) => <AppointmentStatusBadge value={r.status} />,
    },
    {
      key: "actions",
      header: "Acciones",
      cell: (r) => (
        <div className="flex flex-wrap gap-2">
          {r.status === "PENDING" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate(r.appointmentId, "ATTENDED");
              }}
              className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700 transition-colors"
              title="Marcar como atendido"
            >
              ✓ Asistió
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(r.appointmentId);
            }}
            className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600 transition-colors"
          >
            Editar
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(r.appointmentId);
            }}
            className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 mb-12 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Citas Agendadas
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Listado general de citas registradas.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filtrar por estado
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="ATTENDED">Atendidos</option>
            <option value="MISSED">No asistidos</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filtrar por paciente, tipo o motivo
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ej. Paciente #123, Estándar, revisión..."
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4">
          <p className="font-semibold text-red-500">
            No se pudieron cargar las citas.
          </p>
          <p className="mt-1 text-sm text-red-400">
            {error?.message || "Error de red o del servidor"}
          </p>
        </div>
      )}

      <div className="rounded-lg bg-white shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay citas registradas.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.appointmentId} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.cell ? col.cell(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}