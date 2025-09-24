import AppointmentForm from "../components/AppointmentForm";

export default function AdminCreateAppointmentPage() {
  return (
  <main className="mx-auto max-w-screen-xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Nueva cita</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa los datos para registrar una nueva cita.
        </p>
      </header>

      <section className="rounded-xl border border-gray bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-dark">
         <AppointmentForm />
        </p>
      </section>
    </main>
  );
}
