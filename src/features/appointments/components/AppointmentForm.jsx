import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "../../../shared/components/SuccessDialog";
import useDailyQuota from "../hooks/useDailyQuota";
import useAvailableHours from "../hooks/useAvailableHours";
import PatientSelect from "./PatientSelect";
import { createAppointment } from "../services/appointmentService";

// --- Business rules (horario y duración) ---
const SLOT_MINUTES = 30;
const OPEN_HOUR = 9;
const CLOSE_HOUR = 14;

const InitialForm = {
  patientId: "",
  date: "",
  time: "",
  type: "standard",
  reason: "",
  status: "pending",
};

export default function AppointmentForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState(InitialForm);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstInputRef = useRef(null);

  // Hook para obtener horas disponibles
  const { hours: availableHours, loading: hoursLoading, error: hoursError } = 
    useAvailableHours(form.date || null);

  // Hook para cupo diario
  const { count, limit, loading: quotaLoading, error: quotaError, quotaFull } =
    useDailyQuota(form.date || null);

  // Estado de errores por campo
  const [errors, setErrors] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  // Calcula la hora de fin (30 min después)
  const computedEndTime = useMemo(() => {
    if (!form.time) return "";
    const [hh, mm] = form.time.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
    const mins = hh * 60 + mm + SLOT_MINUTES;
    const endH = Math.floor(mins / 60);
    const endM = mins % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }, [form.time]);

  // Validador
  const validate = useCallback((data) => {
    const err = { patientId: "", date: "", time: "", reason: "" };

    // patientId (Integer)
    if (!data.patientId) {
      err.patientId = "Selecciona una mascota.";
    }

    // date
    if (!data.date) {
      err.date = "Selecciona una fecha.";
    } else {
      // Validar que sea día laborable
      const date = new Date(data.date + "T00:00:00");
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        err.date = "Solo se pueden agendar citas de lunes a viernes.";
      }
      
      // Validar que sea fecha futura
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        err.date = "La fecha debe ser futura.";
      }
    }

    // time
    if (!data.time) {
      err.time = "Selecciona una hora.";
    }

    // fecha y hora futura (validación adicional)
    if (data.date && data.time) {
      const startAt = new Date(`${data.date}T${data.time}`);
      const now = new Date();
      if (isNaN(startAt.getTime())) {
        err.date = err.date || "Fecha u hora inválida.";
        err.time = err.time || "Fecha u hora inválida.";
      } else if (startAt <= now) {
        err.time = err.time || "La hora debe ser futura.";
      }
    }

    // reason
    const reasonTrim = data.reason.trim();
    if (!reasonTrim) {
      err.reason = "El motivo es obligatorio.";
    } else if (reasonTrim.length < 5) {
      err.reason = "El motivo debe tener al menos 5 caracteres.";
    } else if (reasonTrim.length > 160) {
      err.reason = "Máximo 160 caracteres.";
    }

    return err;
  }, []);

  const hasErrors = (err) =>
    !!(err.patientId || err.date || err.time || err.reason);

  const onChange = (e) => {
    const { name, value } = e.target;
    
    // Limpiar error del submit anterior
    setSubmitError("");
    
    // Si cambia la fecha, limpiar la hora seleccionada
    if (name === "date") {
      setForm((f) => ({ ...f, date: value, time: "" }));
      setErrors((prev) => ({ ...prev, date: "", time: "" }));
      return;
    }

    // Limpia el error del campo editado y actualiza el estado
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError("");

      // Validación de campos
      const err = validate(form);
      setErrors(err);
      if (hasErrors(err)) {
        const order = ["patientId", "date", "time", "reason"];
        const firstError = order.find((k) => err[k]);
        if (firstError === "patientId") {
          firstInputRef.current?.focus();
        } else {
          document.getElementById(firstError)?.focus();
        }
        return;
      }

      // Validar que la hora esté disponible
      if (!availableHours.includes(form.time)) {
        setErrors((prev) => ({
          ...prev,
          time: "Esta hora ya no está disponible. Selecciona otra.",
        }));
        document.getElementById("time")?.focus();
        return;
      }

      // Cupo diario
      if (quotaFull) {
        setErrors((prev) => ({
          ...prev,
          date: prev.date || "Cupo diario completo (10/10).",
        }));
        document.getElementById("date")?.focus();
        return;
      }

      // Preparar datos para enviar
      const appointmentData = {
        ...form,
        patientId: parseInt(form.patientId, 10),
        reason: form.reason.trim(),
      };

      // Enviar al backend
      setIsSubmitting(true);
      try {
        console.log("Enviando cita con datos:", appointmentData);
        await createAppointment(appointmentData);
        setIsSuccess(true);
        setOpenSuccess(true);
      } catch (error) {
        console.error("Error al crear cita:", error);
        setSubmitError(
          error.message || "No se pudo crear la cita. Inténtalo de nuevo."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, validate, quotaFull, availableHours]
  );

  useEffect(() => {
    if (!isSuccess) return;
    setForm(InitialForm);
    setResetKey((k) => k + 1);
    setTimeout(() => firstInputRef.current?.focus(), 0);
    setIsSuccess(false);
  }, [isSuccess]);

  return (
    <>
      <SuccessDialog
        open={openSuccess}
        title="Cita creada"
        message="Hemos registrado la cita correctamente. El cliente recibirá un correo de confirmación."
        actionLabel="Aceptar"
        onAction={() => {}}
        onClose={() => setOpenSuccess(false)}
      />

      <form
        key={resetKey}
        onSubmit={onSubmit}
        className="grid gap-4"
        autoComplete="off"
        noValidate
      >
        {/* Error general de envío */}
        {submitError && (
          <div className="rounded-lg border border-orange bg-orange/10 p-3 text-sm text-orange">
            {submitError}
          </div>
        )}

        {/* Mascota */}
        <div className="grid gap-1">
          <label htmlFor="patientId" className="text-sm font-medium">
            Mascota
          </label>
          <PatientSelect
            ref={firstInputRef}
            value={form.patientId}
            onSelect={(patientId) => {
              setForm((f) => ({ ...f, patientId }));
              setErrors((prev) => ({ ...prev, patientId: "" }));
              setSubmitError("");
            }}
            error={errors.patientId}
          />
        </div>

        {/* Fecha y hora */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="date" className="text-sm font-medium">
              Fecha
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              min={new Date().toISOString().split("T")[0]}
              className={`rounded-lg border p-2 text-sm focus:outline-none focus:ring ${
                errors.date || quotaFull ? "border-orange" : "border-gray"
              }`}
              required
            />
            {errors.date && (
              <p id="date-error" className="text-xs text-orange">
                {errors.date}
              </p>
            )}
            {quotaLoading && !errors.date && (
              <p className="text-xs text-gray-500">
                Comprobando disponibilidad…
              </p>
            )}
            {!quotaLoading && !quotaError && form.date && !quotaFull && (
              <p className="text-xs text-gray-500">
                Disponibles: {limit - count} / {limit}
              </p>
            )}
            {quotaError && !errors.date && (
              <p className="text-xs text-orange">
                No se pudo comprobar el cupo.
              </p>
            )}
            {quotaFull && !errors.date && (
              <p className="text-xs text-orange">
                Cupo diario completo (10/10). Elige otra fecha.
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor="time" className="text-sm font-medium">
              Hora
            </label>
            <select
              id="time"
              name="time"
              value={form.time}
              onChange={onChange}
              disabled={!form.date || hoursLoading || availableHours.length === 0}
              className={`rounded-lg border p-2 text-sm focus:outline-none focus:ring disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.time ? "border-orange" : "border-gray"
              }`}
              required
            >
              <option value="">
                {!form.date
                  ? "Selecciona primero una fecha"
                  : hoursLoading
                  ? "Cargando horas..."
                  : availableHours.length === 0
                  ? "No hay horas disponibles"
                  : "Selecciona una hora"}
              </option>
              {availableHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            {errors.time && (
              <p id="time-error" className="text-xs text-orange">
                {errors.time}
              </p>
            )}
            {hoursError && !errors.time && (
              <p className="text-xs text-orange">{hoursError}</p>
            )}
            {!errors.time && !hoursError && form.date && !hoursLoading && (
              <p className="text-xs text-gray-500">
                Horario: 09:00–14:00 (lunes a viernes, intervalos de 30 min)
              </p>
            )}
            {form.time && !errors.time && (
              <p className="text-xs text-gray-500">
                Duración: 30 minutos. Termina a{" "}
                <span className="font-medium">{computedEndTime}</span>.
              </p>
            )}
          </div>
        </div>

        {/* Tipo */}
        <div className="grid gap-1">
          <label htmlFor="type" className="text-sm font-medium">
            Tipo de consulta
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={onChange}
            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
          >
            <option value="standard">Consulta estándar</option>
            <option value="vaccine">Vacunación</option>
            <option value="urgent">Urgencia</option>
          </select>
          <p className="text-xs text-gray-500">
            Las vacunaciones se tratan como consultas estándar.
          </p>
        </div>

        {/* Motivo */}
        <div className="grid gap-1">
          <label htmlFor="reason" className="text-sm font-medium">
            Motivo de la cita
          </label>
          <input
            id="reason"
            name="reason"
            value={form.reason}
            onChange={onChange}
            placeholder="Describe brevemente el motivo (5-160 caracteres)"
            className={`rounded-lg border p-2 text-sm focus:outline-none focus:ring ${
              errors.reason ? "border-orange" : "border-gray"
            }`}
            required
          />
          {errors.reason && (
            <p id="reason-error" className="text-xs text-orange">
              {errors.reason}
            </p>
          )}
          {!errors.reason && form.reason.length > 0 && (
            <p className="text-xs text-gray-500">
              {form.reason.length} / 160 caracteres
            </p>
          )}
        </div>

        {/* Estado (opcional, solo para admin) */}
        <div className="grid gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={onChange}
            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
          >
            <option value="pending">Pendiente</option>
            <option value="attended">Atendida</option>
            <option value="past">No asistida</option>
          </select>
          <p className="text-xs text-gray-500">
            Por defecto las nuevas citas se crean como "Pendiente".
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="rounded-lg bg-gray px-4 py-2 text-sm font-medium text-gray-dark hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || hoursLoading || quotaLoading}
            className="rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creando..." : "Crear cita"}
          </button>
        </div>
      </form>
    </>
  );
}