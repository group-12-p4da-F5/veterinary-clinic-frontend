import { Link } from "react-router-dom";

/**
 * Menú inicial para el rol administrador.
 * Muestra accesos rápidos en formato tarjetas.
 */
export default function AdminHomePage() {
  // Aqui se definen los accesos rápidos de la app
  const shortcuts = [
    {
      to: "/admin/appointments/new",               // Crear cita (admin)
      title: "Crear cita",
      desc: "Registrar una nueva cita para cualquier paciente.",
      emoji: "📅",
    },
    {
      to: "/patients",                              // Lista de pacientes 
      title: "Pacientes",
      desc: "Ver todos los pacientes registrados.",
      emoji: "🐾",
    },
    {
      to: "/mis-citas",                    // Lista de citas (propias)      
      title: "Citas",
      desc: "Revisar listado de citas.",
      emoji: "🗂️",
    },
  ];

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Panel administrador</h1>
        <p className="mt-1 text-sm text-gray-500">
          Accesos rápidos a las herramientas de gestión.
        </p>
      </header>

      <section aria-label="Accesos rápidos">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="block rounded-xl border border-gray bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring"
              >
                <div className="mb-2 text-3xl">{s.emoji}</div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{s.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
