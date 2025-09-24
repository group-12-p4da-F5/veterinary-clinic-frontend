import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AppointmentForm from "../components/AppointmentForm"
import Layout from "../../../shared/layout/Layout"

export default function EditAppointmentPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // ✅ Accede al objeto de la cita desde el estado de la ubicación
  const { appointment } = location.state || {}

  // Si no se encuentra el objeto de la cita, navega de vuelta a la lista
  if (!appointment) {
    navigate("/mis-citas", { replace: true });
    
    // Muestra un mensaje de carga o error mientras redirige
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-6 text-center text-red-500">
        Error: No se encontró la cita para editar. Redirigiendo...
      </main>
    );
  }

  return (
    <Layout>
      <main className="mx-auto max-w-screen-xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Editar cita</h1>
          <p className="mt-1 text-sm text-gray-500">
            Modifica los detalles de la cita seleccionada.
          </p>
        </header>

        <section className="rounded-xl border border-gray bg-white p-4 shadow-sm">
          {/* ✅ Pasa el objeto de la cita directamente al formulario */}
          <AppointmentForm initialData={appointment} />
        </section>
      </main>
    </Layout>
  )
}