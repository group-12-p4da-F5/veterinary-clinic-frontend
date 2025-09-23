import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


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

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        // Aquí irá la lógica para enviar el formulario al backend
        console.log("Formulario enviado:", form);
        alert("Mock submit OK (aún sin API). Revisa la consola.");
        setIsSuccess(true);
    }, [form]);

    useEffect(() => {
        if (!isSuccess) return;
        setForm(InitialForm);
        setTimeout(() => firstInputRef.current?.focus(), 0);
        setIsSuccess(false);
    }, [isSuccess]);

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            {/* Paciente (placeholder; luego se reemplaza por <PatientSelect />) */}
            <div className="grid gap-1">
                <label htmlFor="patientId" className="text-sm font-medium">
                    Paciente
                </label>
                <input
                    id="patientId"
                    name="patientId"
                    value={form.patient}
                    onChange={onChange}
                    placeholder="ID de paciente (temporal)"
                    className="rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
                    required
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
    );

}