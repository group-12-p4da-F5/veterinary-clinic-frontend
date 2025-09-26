import React, { useEffect, useMemo, useState } from "react"; // EDIT: useState
import { useLocation, useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";
import SuccessDialog from "../../../shared/components/SuccessDialog"; // EDIT: reutilizamos el mismo dialog

export default function EditAppointmentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  //Accede al objeto de la cita desde el estado de la ubicación
  // EDIT: también leemos una marca para saber si viene desde admin
  const { appointment, fromAdmin } = location.state || {}; // EDIT

  //Fallback inteligente: si viene por /admin/* va al listado de admin, si no a "mis-citas"
  const fallbackPath = useMemo(
    // EDIT: prioriza la marca `fromAdmin`; si no está, mira el pathname
    () => (fromAdmin || location.pathname.startsWith("/admin") ? "/admin/citas-agendadas" : "/mis-citas"),
    [fromAdmin, location.pathname] // EDIT
  );

  //estado para mostrar el diálogo 
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockMsg, setBlockMsg] = useState("");

  //util – parsea start-date soportando "DD/MM/YYYY" y "YYYY-MM-DD"
  function parseAppointmentStart(a) {
    if (!a?.date || !a?.time) return null;
    const t = `${a.time}:00`;
    if (String(a.date).includes("/")) {
      // formato CLI: DD/MM/YYYY
      const [dd, mm, yyyy] = String(a.date).split("/");
      return new Date(`${yyyy}-${mm}-${dd}T${t}`);
    }
    // formato ISO: YYYY-MM-DD
    return new Date(`${a.date}T${t}`);
  }

  //regla – solo pending y con >2h de margen
  function canEdit(a) {
    const statusOk = (a?.status ?? "").toLowerCase() === "pending";
    if (!statusOk) return false;
    const startAt = parseAppointmentStart(a);
    if (!startAt || Number.isNaN(startAt.getTime())) return false;
    const diff = startAt.getTime() - Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    return diff > TWO_HOURS;
  }

  // Si no se encuentra el objeto de la cita, navega de vuelta a la lista
  useEffect(() => {
    if (!appointment) {
      navigate(fallbackPath, { replace: true });
      return;
    }
    //aplica guardas y muestra SuccessDialog
    //SOLO se bloquea a clientes; admin puede editar siempre
    if (!fromAdmin && !canEdit(appointment)) { // EDIT
      const isPending = (appointment?.status ?? "").toLowerCase() === "pending";
      setBlockMsg(
        isPending
          ? "No puedes editar la cita porque faltan 2 horas o menos para su inicio."
          : "Solo se pueden editar citas en estado Pendiente."
      );
      setBlockOpen(true); // abrimos el diálogo; navegamos al cerrar
    }
  }, [appointment, fromAdmin, fallbackPath, navigate]); // EDIT: dependencias

  // Muestra un mensaje de carga o error mientras redirige
  if (!appointment) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-6 text-center text-red-500">
        Error: No se encontró la cita para editar. Redirigiendo...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      {/*diálogo bloqueante “amable” y consistente con tu UI */}
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
        {/*  Pasa el objeto de la cita directamente al formulario */}
        <AppointmentForm initialData={appointment} />
      </section>
    </main>
  );
}
