import { Link } from "react-router-dom";
// Importar iconos de Lucide-React
import { Calendar, Users, ListChecks, Stethoscope } from 'lucide-react';

/**
 * Menú inicial para el rol administrador.
 * Muestra accesos rápidos en formato tarjetas.
 */
export default function AdminHomePage() {
  // Aquí se definen los accesos rápidos de la app
  const shortcuts = [
    {
      to: "/nueva-cita",
      title: "Crear Cita",
      desc: "Registrar una nueva cita para cualquier paciente.",
      Icon: Calendar, // Usamos el componente Icono
    },
    {
      to: "/pacientes",
      title: "Pacientes",
      desc: "Ver todos los pacientes registrados.",
      Icon: Users, // Usamos el componente Icono
    },
    {
      to: "/admin/citas-agendadas",
      title: "Citas Agendadas",
      desc: "Revisar listado completo de citas.",
      Icon: ListChecks, // Usamos el componente Icono
    },
    {
      to: "/tratamiento/:treatmentId", // La navegación a tratamientos comienza seleccionando un paciente
      title: "Tratamientos",
      desc: "Acceder a los registros médicos y planes de tratamiento.",
      Icon: Stethoscope, // Usamos el componente Icono
    },
  ];

  return (
    // Se usa max-w-full para ocupar todo el ancho y se aumenta el padding lateral (px-16)
    <main className="mx-auto max-w-full px-16 py-16"> 
      <header className="mb-12 text-center"> {/* Aumentamos el margen inferior */}
        <h1 className="text-5xl font-extrabold text-gray-800">Panel de Administración</h1> {/* Título más grande */}
        <p className="mt-4 text-xl text-gray-500">
          Accesos rápidos y herramientas de gestión clínica.
        </p>
      </header>

      <section aria-label="Accesos rápidos" className="shadow-2xl rounded-3xl p-8 bg-white border border-gray-100">
        {/* Clase CLAVE: grid-cols-4 para la fila única */}
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"> 
          {shortcuts.map((s) => (
            <li key={s.to + s.title}>
              <Link
                to={s.to}
                // CLASE CLAVE: p-10 para hacer la tarjeta más grande internamente
                className="group block h-full rounded-2xl border border-green-300 bg-green-50 p-10 shadow-xl transition duration-300 hover:shadow-2xl hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50"
              >
                <div className="flex items-center space-x-4">
                  {/* Ícono aún más grande */}
                  <s.Icon className="h-12 w-12 text-green-600 transition group-hover:scale-110 duration-300" strokeWidth={2.5} />
                  
                  <div>
                    {/* CAMBIO AQUÍ: Cambiamos el color del texto a gris (text-gray-800) */}
                    <h2 className="text-2xl font-bold text-gray-800">{s.title}</h2> {/* Título de tarjeta más grande */}
                  </div>
                </div>

                <p className="mt-4 text-base text-green-700">{s.desc}</p> {/* Descripción más grande */}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
