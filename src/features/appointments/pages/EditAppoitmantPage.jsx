import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppointmentById } from "../services/appointmentService";
import AppointmentForm from "../components/AppointmentForm";

export default function EditAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Cargando cita ID:", id);
        
        const data = await getAppointmentById(parseInt(id, 10));
        console.log("Cita cargada:", data);
        
        // Convertir el formato del backend al formato del formulario
        const dt = new Date(data.dateTime);
        const date = dt.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = dt.toTimeString().slice(0, 5); // HH:mm
        
        const formattedAppointment = {
          appointmentId: data.appointmentId,
          patientId: data.patientId.toString(),
          date: date,
          time: time,
          type: data.type === "EMERGENCY" ? "urgent" : "standard",
          reason: data.reason || "",
          status: data.status.toLowerCase(),
          dateTime: data.dateTime
        };
        
        console.log("Datos formateados para el formulario:", formattedAppointment);
        setAppointment(formattedAppointment);
      } catch (err) {
        console.error("Error al cargar la cita:", err);
        setError(err.message || "No se pudo cargar la cita");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange border-r-transparent mb-4"></div>
          <p className="text-gray-600">Cargando cita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-lg border border-red-500 bg-red-50 p-4">
          <h2 className="font-semibold text-red-500 mb-2">Error al cargar la cita</h2>
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={() => navigate("/admin/citas-agendadas")}
            className="mt-4 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Editar Cita</h1>
        <p className="mt-1 text-sm text-gray-600">
          Modifica los datos de la cita agendada
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <AppointmentForm 
          initialData={appointment} 
          isEditMode={true}
        />
      </div>
    </div>
  );
}