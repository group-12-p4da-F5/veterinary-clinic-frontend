import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAppointmentById } from "../services/appointmentService";
import AppointmentForm from "../components/AppointmentForm";
import SuccessDialog from "../../../shared/components/SuccessDialog";

export default function EditAppointmentPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Obtenemos appointment y fromAdmin desde location.state si viene desde Admin
  const locationState = location.state || {};
  const fromAdmin = locationState.fromAdmin || false;

  const [appointment, setAppointment] = useState(locationState.appointment || null);
  const [loading, setLoading] = useState(!appointment); // solo cargamos si no hay appointment
  const [error, setError] = useState(null);

  const [blockOpen, setBlockOpen] = useState(false);
  const [blockMsg, setBlockMsg] = useState("");

  const fallbackPath = useMemo(
    () =>
      fromAdmin || location.pathname.startsWith("/admin")
        ? "/admin/citas-agendadas"
        : "/mis-citas",
    [fromAdmin, location.pathname]
  );

  // Función para parsear fecha + hora en objeto Date
  function parseAppointmentStart(a) {
    if (!a?.date || !a?.time) return null;
    const t = `${a.time}:00`;
    if (String(a.date).includes("/")) {
      const [dd, mm, yyyy] = String(a.date).split("/");
      return new Date(`${yyyy}-${mm}-${dd}T${t}`);
    }
    return new Date(`${a.date}T${t}`);
  }

  // Reglas de edición: pendiente y >2h
  function canEdit(a) {
    const statusOk = (a?.status ?? "").toLowerCase() === "pending";
    if (!statusOk) return false;
    const startAt = parseAppointmentStart(a);
    if (!startAt || Number.isNaN(startAt.getTime())) return false;
    const diff = startAt.getTime() - Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    return diff > TWO_HOURS;
  }

  // Fetch desde backend si no hay appointment en state
  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAppointmentById(parseInt(id, 10));

        // Convertimos al formato del formulario
        const dt = new Date(data.dateTime);
        const date = dt.toISOString().split("T")[0]; // YYYY-MM-DD
        const time = dt.toTimeString().slice(0, 5); // HH:mm

        const formattedAppointment = {
          appointmentId: data.appointmentId,
          patientId: data.patientId.toString(),
          date,
          time,
          type: data.type === "EMERGENCY" ? "urgent" : "standard",
          reason: data.reason || "",
          status: data.status.toLowerCase(),
          dateTime: data.dateTime,
        };

        setAppointment(formattedAppointment);
      } catch (err) {
        console.error(err);
        setError(err.message || "No se pudo cargar la cita");
      } finally {
        setLoading(false);
      }
    };

    if (!appointment && id) {
      loadAppointment();
    }
  }, [appointment, id]);

  // Efecto para bloquear edición según reglas
  useEffect(() => {
    if (!appointment) return;

    if (!fromAdmin && !canEdit(appointment)) {
      const isPending = (appointment?.status ?? "").toLowerCase() === "pending";
      setBlockMsg(
        isPending
          ? "No puedes editar la cita porque faltan 2 horas o menos para su inicio."
          : "Solo se pueden editar citas en estado Pendiente."
      );
      setBlockOpen(true);
    }
  }, [appointment, fromAdmin]);

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

  if (!appointment) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-6 text-center text-red-500">
        Error: No se encontró la cita para editar. Redirigiendo...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <SuccessDialog
        open={blockOpen}
        title="Edición no permitida"
        message={blockMsg}
        actionLabel="Aceptar"
        onAction={() => {
          setBlockOpen(false);
          navigate(fallbackPath, { replace: true });
        }}
        onClose={() => {
          setBlockOpen(false);
          navigate(fallbackPath, { replace: true });
        }}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Editar cita</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica los detalles de la cita seleccionada.
        </p>
      </header>

      <section className="rounded-xl border border-gray bg-white p-4 shadow-sm">
        <AppointmentForm initialData={appointment} isEditMode={true} />
      </section>
    </main>
  );
}
