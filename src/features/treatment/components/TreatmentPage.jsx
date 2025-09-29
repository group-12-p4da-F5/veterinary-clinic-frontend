import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TreatmentFicha from './TreatmentFicha';

export default function TreatmentPage() {
  const { treatmentId } = useParams();
  const [treatmentData, setTreatmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Datos internos (idénticos a AdminTreatmentListPage) ---
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

  useEffect(() => {
    const fetchTreatment = async () => {
      setLoading(true);
      setError(null);
      await new Promise(r => setTimeout(r, 300)); // simula retraso de API

      const found = MOCK_TREATMENTS.find(t => String(t.id) === String(treatmentId));
      if (found) setTreatmentData(found);
      else setError('Tratamiento no encontrado.');

      setLoading(false);
    };

    fetchTreatment();
  }, [treatmentId]);

  if (loading)
    return <p className="text-center py-10 text-gray-700">Cargando ficha del tratamiento...</p>;

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-600 mb-4">{error}</p>
        <Link to="/admin/tratamientos" className="underline text-blue-600">
          Volver al listado
        </Link>
      </div>
    );

  return <TreatmentFicha data={treatmentData} />;
}
