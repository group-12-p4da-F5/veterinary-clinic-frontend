import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

// Componente para mostrar el estado del tratamiento
const TreatmentStatusBadge = ({ status }) => {
  let colorClasses = '';
  switch (status) {
    case 'Activo':
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'Finalizado':
      colorClasses = 'bg-gray-100 text-gray-700';
      break;
    case 'Pendiente':
      colorClasses = 'bg-red-100 text-red-700';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-700';
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${colorClasses}`}>
      {status}
    </span>
  );
};

export default function AdminTreatmentListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // --- Datos internos del componente ---
  const MOCK_TREATMENTS = [
    {
      id: '101',
      nombreMascota: 'Cookie',
      tutor: 'Ana García',
      diagnostico: 'Infección de oído. Otitis externa bilateral.',
      tratamientoRecomendado: ['Limpieza auricular diaria', 'Antibiótico oral 250mg cada 12h'],
      orientacionesTutor: ['Administrar la medicación', 'Evitar agua en los oídos'],
      proximaCita: 'Revisión en 10 días',
      firmaVeterinario: 'Dr. Juan Pérez (Vet. #12345)',
      lugarFecha: 'Clínica Veterinaria Margarida, 2025-09-01',
      status: 'Activo',
    },
    {
      id: '102',
      nombreMascota: 'Mila',
      tutor: 'Luis Pérez',
      diagnostico: 'Control post-operatorio',
      tratamientoRecomendado: ['Retiro de puntos', 'Mantener la herida limpia'],
      orientacionesTutor: ['Evitar que la mascota se lama la herida'],
      proximaCita: 'Cita para retiro de puntos el 2025-09-01',
      firmaVeterinario: 'Dra. Laura Gómez (Vet. #67890)',
      lugarFecha: 'Clínica Veterinaria Margarida, 2025-08-25',
      status: 'Finalizado',
    },
    {
      id: '103',
      nombreMascota: 'Rocky',
      tutor: 'Marta Díaz',
      diagnostico: 'Fractura en pata',
      tratamientoRecomendado: ['Férula y analgésicos', 'Evitar saltos'],
      orientacionesTutor: ['Observar la curación y mantener la férula limpia'],
      proximaCita: 'Revisión en 3 semanas',
      firmaVeterinario: 'Dr. Gómez',
      lugarFecha: 'Clínica Veterinaria Margarida, 2025-09-15',
      status: 'Activo',
    },
    {
      id: '104',
      nombreMascota: 'Toby',
      tutor: 'Javier Sanz',
      diagnostico: 'Vacuna anual',
      tratamientoRecomendado: ['Dosis antirrábica'],
      orientacionesTutor: ['Vacunación completada'],
      proximaCita: 'Si es necesario',
      firmaVeterinario: 'Dra. Soler',
      lugarFecha: 'Clínica Veterinaria Margarida, 2025-07-01',
      status: 'Finalizado',
    },
  ];

  // Filtrado
  const filteredTreatments = useMemo(() => {
    if (!searchTerm) return MOCK_TREATMENTS;
    const lower = searchTerm.toLowerCase();
    return MOCK_TREATMENTS.filter(
      t => t.nombreMascota.toLowerCase().includes(lower) || t.tutor.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tratamientos (administrador)</h1>
      </header>

      <div className="mb-6">
        <div className="relative rounded-lg shadow-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            placeholder="Filtrar por paciente o dueño"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border-none bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Mascota</th>
              <th className="py-3 px-4 text-left">Dueño</th>
              <th className="py-3 px-4 text-left">Diagnóstico</th>
              <th className="py-3 px-4 text-left">Tratamiento</th>
              <th className="py-3 px-4 text-left">Próxima cita</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTreatments.map(t => (
              <tr key={t.id}>
                <td className="py-2 px-4">{t.nombreMascota}</td>
                <td className="py-2 px-4">{t.tutor}</td>
                <td className="py-2 px-4">{t.diagnostico}</td>
                <td className="py-2 px-4">{t.tratamientoRecomendado.join(', ')}</td>
                <td className="py-2 px-4">{t.proximaCita}</td>
                <td className="py-2 px-4"><TreatmentStatusBadge status={t.status} /></td>
                <td className="py-2 px-4">
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700"
                    onClick={() => navigate(`/tratamiento/${t.id}`)}
                  >
                    Ver Tratamiento
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
