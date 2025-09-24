import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SuccessDialog from "../../../shared/components/SuccessDialog"

const InitialForm = {
  patientId: "",
  date: "",
  time: "",
  type: "standard",
  reason: "",
  status: "pending",
}

export default function AppointmentForm({ initialData }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialData || InitialForm)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [errors, setErrors] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
  })

  const validate = useCallback((data) => {
    const err = { patientId: "", date: "", time: "", reason: "" }
    if (!data.patientId.trim()) {
      err.patientId = "Selecciona un paciente válido."
    }
    if (!data.date) {
      err.date = "Selecciona una fecha."
    }
    if (!data.time) {
      err.time = "Selecciona una hora."
    }
    if (data.date && data.time) {
      const startAt = new Date(`${data.date}T${data.time}`)
      const now = new Date()
      if (isNaN(startAt.getTime())) {
        err.date = err.date || "Fecha u hora inválida."
        err.time = err.time || "Fecha u hora inválida."
      } else if (startAt <= now) {
        err.date = err.date || "Debe ser una fecha futura."
        err.time = err.time || "Debe ser una hora futura."
      }
    }
    const reasonTrim = data.reason.trim()
    if (!reasonTrim) {
      err.reason = "El motivo es obligatorio."
    } else if (reasonTrim.length < 3) {
      err.reason = "El motivo debe tener al menos 3 caracteres."
    } else if (reasonTrim.length > 160) {
      err.reason = "Máximo 160 caracteres."
    }
    return err
  }, [])

  const hasErrors = (err) => !!(err.patientId || err.date || err.time || err.reason)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const err = validate(form)
      setErrors(err)
      if (hasErrors(err)) {
        console.log("Formulario con errores, no se envía.")
        return
      }

      if (initialData) {
        console.log("Formulario de edición enviado:", form)
        // Aquí iría la llamada a la API para actualizar
      } else {
        console.log("Formulario de creación enviado:", form)
        // Aquí iría la llamada a la API para crear
      }

      setIsSuccess(true)
      setOpenSuccess(true)
    },
    [form, validate, initialData]
  )

  useEffect(() => {
    if (!isSuccess) return
    setForm(InitialForm)
    setResetKey((k) => k + 1)
    setTimeout(() => firstInputRef.current?.focus(), 0)
    setIsSuccess(false)
  }, [isSuccess])

  return (
    <>
      <SuccessDialog
        open={openSuccess}
        title={initialData ? "Cita actualizada" : "Cita creada"}
        message={
          initialData
            ? "Los cambios han sido guardados correctamente."
            : "Hemos registrado la cita correctamente. El cliente recibirá un correo de confirmación."
        }
        actionLabel="Aceptar"
        onAction={() => {}}
        onClose={() => setOpenSuccess(false)}
      />
      <form key={resetKey} onSubmit={onSubmit} className="grid gap-4" autoComplete="off">
        {/* Paciente (placeholder) */}
        <div className="grid gap-1">
          <label htmlFor="patientId" className="text-sm font-medium">
            Paciente
          </label>
          <input
            id="patientId"
            name="patientId"
            value={form.patientId}
            onChange={onChange}
            placeholder="ID de paciente (temporal)"
            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
            required
          />
          <p className="text-xs text-gray-dark"></p>
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
              className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
              required
            />
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
              className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
              required
            />
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
            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
            required
          />
        </div>

        {/* Estado */}
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
            {initialData ? "Guardar cambios" : "Crear cita"}
          </button>
        </div>
      </form>
    </>
  )
}