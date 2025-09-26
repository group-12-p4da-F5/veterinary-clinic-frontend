import React, { useState, useEffect } from 'react';
import TreatmentFicha from './components/TreatmentFicha.jsx'; 

function TreatmentPage({ treatmentId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const mockData = {
    nombreMascota: "Cookie", edad: "12 años", especie: "Canina", raza: "Pomerania", 
    color: "Marrón y Blanco", peso: "3.5 Kg", tutor: "Larissa",
    diagnostico: "Distensión muscular en el hombro derecho, posiblemente debida a un esfuerzo físico intenso.",
    tratamientoRecomendado: [
        "Descanso de 5 a 7 días, sin actividad física intensa.",
        "Medicamentos antiinflamatorios durante 5 días.",
        "Compresas tibias durante las siguientes 48 horas.",
    ],
    orientacionesTutor: ["Evite jugar y correr.", "Vigile signos de dolor."],
    proximaCita: "17/11/2025 para reevaluación de la lesión.",
    firmaVeterinario: "Dr. Jesús Martins",
    lugarFecha: "Clinica Margarita - Gijón, Asturias"
  };

  useEffect(() => {
    // Aquí es donde realizarás la llamada a tu API de Spring Boot
    const fetchTreatmentData = async () => {
      try {
        setLoading(true);
        setError(null);

        await new Promise(resolve => setTimeout(resolve, 1000));
        

        setData(mockData); 
        
      } catch (err) {
        console.error("Error al cargar el tratamiento:", err);
        setError("Error al cargar los datos del tratamiento. Inténtelo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

        fetchTreatmentData(); 
  
  }, [treatmentId]); 

  if (loading) {
    return <div className="text-center p-10 text-lg font-medium text-green-600">Cargando ficha del tratamiento...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-lg text-red-600 border border-red-300 bg-red-50 mx-auto max-w-lg rounded-md">{error}</div>;
  }
  
  if (!data) {
      return <div className="text-center p-10 text-gray-500">No se encontraron datos para este tratamiento.</div>;
  }

  // Si todo es exitoso, renderiza el componente de presentación
  return <TreatmentFicha data={data} />;
}
export default TreatmentPage;