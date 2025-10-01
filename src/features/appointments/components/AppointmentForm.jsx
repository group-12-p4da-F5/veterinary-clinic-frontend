import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "../../../shared/components/SuccessDialog";
import useDailyQuota from "../hooks/useDailyQuota";
import useAvailableHours from "../hooks/useAvailableHours";
import PatientSelect from "./PatientSelect";
import { createAppointment, updateAppointment } from "../services/appointmentService";

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

export default function AppointmentForm({ initialData = null, isEditMode = false }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialData || InitialForm);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstInputRef = useRef(null);

  // Actualizar el formulario cuando cambian los datos iniciales (modo edición)
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const { hours: availableHours, loading: hoursLoading, error: hoursError } = 
    useAvailableHours(form.date || null);

  const { count, limit, loading: quotaLoading, error: quotaError, quotaFull } =
    useDailyQuota(form.date || null);

  const [errors, setErrors] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  const computedEndTime = useMemo(() => {
    if (!form.time) return "";
    const [hh, mm] = form.time.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
    const mins = hh * 60 + mm + SLOT_MINUTES;
    const endH = Math.floor(mins / 60);
    const endM = mins % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }, [form.time]);

  const validate = useCallback((data) => {
    const err = { patientId: "", date: "", time: "", reason: "" };

    if (!data.patientId) {
      err.patientId = "Selecciona una mascota.";
    }

    if (!data.date) {
      err.date = "Selecciona una fecha.";
    } else {
      const date = new Date(data.date + "T00:00:00");
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        err.date = "Solo se pueden agendar citas de lunes a viernes.";
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        err.date = "La fecha debe ser futura.";
      }
    }

    if (!data.time) {
      err.time = "Selecciona una hora.";
    }

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
    
    setSubmitError("");
    
    if (name === "date") {
      setForm((f) => ({ ...f, date: value, time: "" }));
      setErrors((prev) => ({ ...prev, date: "", time: "" }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitError("");

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

      // En modo edición, permitir la hora actual si no ha cambiado
      const hasChangedDateTime = isEditMode && initialData && 
        (form.date !== initialData.date || form.time !== initialData.time);

      if (hasChangedDateTime || !isEditMode) {
        if (!availableHours.includes(form.time)) {
          setErrors((prev) => ({
            ...prev,
            time: "Esta hora ya no está disponible. Selecciona otra.",
          }));
          document.getElementById("time")?.focus();
          return;
        }
      }

      if (!isEditMode && quotaFull) {
        setErrors((prev) => ({
          ...prev,
          date: prev.date || "Cupo diario completo (10/10).",
        }));
        document.getElementById("date")?.focus();
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEditMode && initialData?.appointmentId) {
          // MODO EDICIÓN
          const dateTime = `${form.date}T${form.time}:00`;
          const updateData = {
            dateTime: dateTime,
            reason: form.reason.trim()
          };
          
          console.log("Actualizando cita ID:", initialData.appointmentId, "con datos:", updateData);
          await updateAppointment(initialData.appointmentId, updateData);
          
          setIsSuccess(true);
          setOpenSuccess(true);
          
          // Redirigir después de mostrar el diálogo
          setTimeout(() => {
            navigate("/admin/citas-agendadas");
          }, 1500);
        } else {
          // MODO CREACIÓN
          const appointmentData = {
            ...form,
            patientId: parseInt(form.patientId, 10),
            reason: form.reason.trim(),
          };

          console.log("Creando cita con datos:", appointmentData);
          await createAppointment(appointmentData);
          setIsSuccess(true);
          setOpenSuccess(true);
        }
      } catch (error) {
        console.error("Error al guardar cita:", error);
        setSubmitError(
          error.message || "No se pudo guardar la cita. Inténtalo de nuevo."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, validate, quotaFull, availableHours, isEditMode, initialData, navigate]
  );

  useEffect(() => {
    if (!isSuccess || isEditMode) return;
    setForm(InitialForm);
    setResetKey((k) => k + 1);
    setTimeout(() => firstInputRef.current?.focus(), 0);
    setIsSuccess(false);
  }, [isSuccess, isEditMode]);

  return (
    <>
      <SuccessDialog
        open={openSuccess}
        title={isEditMode ? "Cita actualizada" : "Cita creada"}
        message={
          isEditMode
            ? "La cita se ha actualizado correctamente."
            : "Hemos registrado la cita correctamente. El cliente recibirá un correo de confirmación."
        }
        actionLabel="Aceptar"
        onAction={() => {
          setOpenSuccess(false);
          if (isEditMode) {
            navigate("/admin/citas-agendadas");
          }
        }}
        onClose={() => {
          setOpenSuccess(false);
          if (isEditMode) {
            navigate("/admin/citas-agendadas");
          }
        }}
      />

      <form
        key={resetKey}
        onSubmit={onSubmit}
        className="grid gap-4"
        autoComplete="off"
        noValidate
      >
        {submitError && (
          <div className="rounded-lg border border-orange bg-orange/10 p-3 text-sm text-orange">
            {submitError}
          </div>
        )}

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
            disabled={isEditMode}
          />
          {isEditMode && (
            <p className="text-xs text-gray-500">
              El paciente no puede modificarse en una cita existente.
            </p>
          )}
        </div>

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
            {!quotaLoading && !quotaError && form.date && !quotaFull && !isEditMode && (
              <p className="text-xs text-gray-500">
                Disponibles: {limit - count} / {limit}
              </p>
            )}
            {quotaError && !errors.date && (
              <p className="text-xs text-orange">
                No se pudo comprobar el cupo.
              </p>
            )}
            {quotaFull && !errors.date && !isEditMode && (
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
              {/* En modo edición, incluir la hora actual aunque no esté disponible */}
              {isEditMode && initialData && form.time && !availableHours.includes(form.time) && (
                <option value={form.time}>{form.time} (hora actual)</option>
              )}
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

        <div className="grid gap-1">
          <label htmlFor="type" className="text-sm font-medium">
            Tipo de consulta
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={onChange}
            disabled={isEditMode}
            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="standard">Consulta estándar</option>
            <option value="vaccine">Vacunación</option>
            <option value="urgent">Urgencia</option>
          </select>
          <p className="text-xs text-gray-500">
            {isEditMode 
              ? "El tipo de cita no puede modificarse."
              : "Las vacunaciones se tratan como consultas estándar."}
          </p>
        </div>

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

        {!isEditMode && (
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
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(isEditMode ? "/admin/citas-agendadas" : -1)}
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
            {isSubmitting 
              ? (isEditMode ? "Actualizando..." : "Creando...") 
              : (isEditMode ? "Actualizar cita" : "Crear cita")}
          </button>
        </div>
      </form>
    </>
  );
}