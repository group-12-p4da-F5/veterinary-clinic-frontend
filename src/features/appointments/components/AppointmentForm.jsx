import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "../../../shared/components/SuccessDialog";
import useDailyQuota from "../hooks/useDailyQuota";
import PatientSelect from "./PatientSelect"; // EDIT: uso del selector de paciente (ruta corregida)

// --- Business rules (horario y duración) ---
const SLOT_MINUTES = 30;     // cada cita dura 30'
const OPEN_HOUR = 9;         // abre 09:00
const CLOSE_HOUR = 14;       // cierra 14:00
const OPEN_MINUTES = OPEN_HOUR * 60;   // 540
const CLOSE_MINUTES = CLOSE_HOUR * 60; // 840

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
  const [resetKey, setResetKey] = useState(0); // resetea el formulario
  const [openSuccess, setOpenSuccess] = useState(false);

  const firstInputRef = useRef(null); // referencia para enfocar el primer campo

  // confirmamos cupo diario (≤10)
  const { count, limit, loading: quotaLoading, error: quotaError, quotaFull } =
    useDailyQuota(form.date || null);

  //estado de errores por campo
  const [errors, setErrors] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  });

  // calcula la hora de fin (30 min después) para mostrarla en la UI
  const computedEndTime = useMemo(() => {
    if (!form.time) return "";
    const [hh, mm] = form.time.split(":").map(Number);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return "";
    const mins = hh * 60 + mm + SLOT_MINUTES; // EDIT: usa constante
    const endH = Math.floor(mins / 60);
    const endM = mins % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }, [form.time]);

  // Genera los horarios válidos: 09:00, 09:30, … 13:30  (EDIT: nuevo rango)
  const timeSlots = useMemo(() => {
    const out = [];
    for (let h = 9; h <= 13; h++) {
      out.push(`${String(h).padStart(2, "0")}:00`);
      out.push(`${String(h).padStart(2, "0")}:30`);
    }
    return out;
  }, []);

  // validador simple
  const validate = useCallback((data) => {
    const err = { patientId: "", date: "", time: "", reason: "" };

    // patientId
    if (!data.patientId.trim()) {
      err.patientId = "Selecciona un paciente válido.";
    }

    // date
    if (!data.date) {
      err.date = "Selecciona una fecha.";
    }

    // time
    if (!data.time) {
      err.time = "Selecciona una hora.";
    } else {
      const [hh, mm] = data.time.split(":").map(Number);

      // Solo intervalos de 30 min
      if (![0, 30].includes(mm)) {
        err.time = "Solo intervalos de 30 minutos (:00 o :30).";
      }

      const startMins = hh * 60 + mm;
      const endMins = startMins + SLOT_MINUTES;

      // EDIT: rango 09:00–14:00 (último inicio 13:30)
      if (startMins < OPEN_MINUTES || endMins > CLOSE_MINUTES) {
        err.time =
          err.time ||
          "Horario 09:00–14:00 (último inicio 13:30).";
      }
    }

    // fecha y hora futura (si hay ambas)
    if (data.date && data.time) {
      const startAt = new Date(`${data.date}T${data.time}`);
      const now = new Date();
      if (isNaN(startAt.getTime())) {
        err.date = err.date || "Fecha u hora inválida.";
        err.time = err.time || "Fecha u hora inválida.";
      } else if (startAt <= now) {
        err.date = err.date || "Debe ser una fecha futura.";
        err.time = err.time || "Debe ser una hora futura.";
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

    // Validación estricta para el campo HORA (bloquea valores inválidos antes de actualizar estado)
    if (name === "time") {
      if (!value) {
        setForm((f) => ({ ...f, time: "" }));
        setErrors((prev) => ({ ...prev, time: "" }));
        return;
      }

      // 1) Debe coincidir con hh:mm y minutos 00 o 30
      const isSlot = /^([01]\d|2[0-3]):(00|30)$/.test(value);
      if (!isSlot) {
        setErrors((prev) => ({
          ...prev,
          time: "Solo intervalos de 30 minutos (:00 o :30).",
        }));
        return; // no actualizamos estado
      }

      // 2) EDIT: rango 09:00–14:00 (último inicio 13:30)
      const [hh, mm] = value.split(":").map(Number);
      const startMins = hh * 60 + mm;
      const endMins = startMins + SLOT_MINUTES;
      if (startMins < OPEN_MINUTES || endMins > CLOSE_MINUTES) {
        setErrors((prev) => ({
          ...prev,
          time: "Horario 09:00–14:00 (último inicio 13:30).",
        }));
        return; // no actualizamos estado
      }

      setErrors((prev) => ({ ...prev, time: "" }));
    }

    // Limpia el error del campo editado y actualiza el estado (incluye time si era válido)
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      // Validación de campos
      const err = validate(form);
      setErrors(err);
      if (hasErrors(err)) {
        const order = ["patientId", "date", "time", "reason"];
        const firstError = order.find((k) => err[k]);
        document.getElementById(firstError)?.focus();
        return;
      }

      // Cupo diario (UI/UX). El backend debe validar.
      if (quotaFull) {
        setErrors((prev) => ({
          ...prev,
          date: prev.date || "Cupo diario completo (10/10).",
        }));
        const el = document.getElementById("date");
        el?.focus();
        return;
      }

      // Aquí irá la lógica para enviar el formulario al backend
      console.log("Formulario enviado:", form);

      setIsSuccess(true);
      setOpenSuccess(true);
    },
    [form, validate, quotaFull]
  );

  useEffect(() => {
    if (!isSuccess) return;
    setForm(InitialForm);
    setResetKey((k) => k + 1);
    // Enfocar el primer input (ID de paciente)
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
        {/* Paciente (placeholder; luego se reemplaza por <PatientSelect />) */}
        {/* EDIT: Reemplazado input por PatientSelect (autocomplete local) */}
        <div className="grid gap-1">
          <label htmlFor="patientId" className="text-sm font-medium">
            Paciente
          </label>
          <PatientSelect
            value={form.patientId}
            onSelect={(id) => {
              setForm((f) => ({ ...f, patientId: id }));
              setErrors((prev) => ({ ...prev, patientId: "" }));
            }}
            error={errors.patientId}
          />
          <p className="text-xs text-gray-dark">
            {/* * En el siguiente paso esto será un buscador (nombre/DNI). */}
          </p>
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
              className={`rounded-lg border p-2 text-sm focus:outline-none focus:ring ${
                errors.date || quotaFull ? "border-orange" : "border-gray"
              }`}
              required
            />
            {/* Info de cupo diario */}
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
            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={onChange}
              /* EDIT: intervalos de 30 min y último inicio 13:30 */
              step="1800"
              min="09:00"
              max="13:30"
              className={`rounded-lg border p-2 text-sm focus:outline-none focus:ring ${
                errors.time ? "border-orange" : "border-gray"
              }`}
              required
            />
            {errors.time && (
              <p id="time-error" className="text-xs text-orange">
                {errors.time}
              </p>
            )}
            {/* EDIT: mensaje de horario permitido */}
            {!errors.time && (
              <p className="text-xs text-gray-500">
                Horario permitido: 09:00–14:00 (último inicio 13:30).
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
            placeholder="Describe brevemente el motivo"
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
        </div>

        {/* Estado (por defecto pendiente; admin puede cambiarlo si procede) */}
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
            <option value="past">Pasada</option>
          </select>
        </div>

        {/* Acciones */}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-gray px-4 py-2 text-sm font-medium text-gray-dark hover:opacity-90"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Crear cita
          </button>
        </div>
      </form>
    </>
  );
}
