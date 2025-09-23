/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "../../../shared/components/SuccessDialog";


const InitialForm = {
    patient: "",
    date: "",
    time: "",
    type: "",
    reason: "",
    status: ""
};

export default function AppointmentForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(InitialForm);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resetKey, setResetKey] = useState(0); // resetea el formulario
    const [openSuccess, setOpenSuccess] = useState(false);

    // EDIT: estado de errores por campo
    const [errors, setErrors] = useState({
        patientId: "",
        date: "",
        time: "",
        reason: "",
    });

    // EDIT: validador simple
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
        }

        // fecha y hora futura (si hay ambas)
        if (data.date && data.time) {
            const startAt = new Date(`${data.date}T${data.time}`);
            const now = new Date();
            if (isNaN(startAt.getTime())) {
                err.date = err.date || "Fecha u hora inválida.";
                err.time = err.time || "Fecha u hora inválida.";
            } else if (startAt <= now) {
                // puedes decidir si marcar ambos o solo uno
                err.date = err.date || "Debe ser una fecha futura.";
                err.time = err.time || "Debe ser una hora futura.";
            }
        }

        // reason
        const reasonTrim = data.reason.trim();
        if (!reasonTrim) {
            err.reason = "El motivo es obligatorio.";
        } else if (reasonTrim.length < 3) {
            err.reason = "El motivo debe tener al menos 3 caracteres.";
        } else if (reasonTrim.length > 160) {
            err.reason = "Máximo 160 caracteres.";
        }

        return err;
    }, []);

    const hasErrors = (err) =>
        !!(err.patientId || err.date || err.time || err.reason);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        // Aquí irá la lógica para enviar el formulario al backend
        console.log("Formulario enviado:", form);
        setIsSuccess(true);
        setOpenSuccess(true);
    }, [form]);

    useEffect(() => {
        if (!isSuccess) return;
        setForm(InitialForm);
        setResetKey((k) => k + 1);
        // Enfocar el primer input (ID de paciente)
        setTimeout(() => firstInputRef.current?.focus(), 0);
        setIsSuccess(false);
    }, [isSuccess]);

    return (
        <><SuccessDialog
            open={openSuccess}
            title="Cita creada"
            message="Hemos registrado la cita correctamente. El cliente recibirá un correo de confirmación."
            actionLabel="Aceptar"
            onAction={() => { }}
            onClose={() => setOpenSuccess(false)} /><form
                key={resetKey}
                onSubmit={onSubmit}
                className="grid gap-4"
                autoComplete="off"
            >
                {/* Paciente (placeholder; luego se reemplaza por <PatientSelect />) */}
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
                        required />
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
                            className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
                            required />
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
                            required />
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
                        required />
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
            </form></>
    );

}