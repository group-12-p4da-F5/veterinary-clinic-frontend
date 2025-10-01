import React from 'react';
import DataRow from './DataRow';
import ContentSection from './ContentSection';

// Los datos (data) deben venir de tu llamada a Spring Boot
const FichaTratamiento = ({ data }) => {
  if (!data) {
    return <div className="p-4 text-center text-red-600">No hay datos de tratamiento para mostrar.</div>;
  }
  
  return (

    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl my-10 border border-gray-200 print:shadow-none print:border-0">
      
      <div className="flex justify-between items-start mb-6 print:hidden">
        <h1 className="text-3xl font-light text-gray-800">Tratamiento</h1>
        <div className="flex space-x-3">
          <button 
            className="flex items-center space-x-2 p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >  
            <span>Guardar en PDF</span> 
          </button>
          <button 
            onClick={() => window.print()} // Llama a la función de impresión del navegador
            className="flex items-center space-x-2 p-2 bg-green-300 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            <span>Imprimir</span>
          </button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-green-900 mb-4 border-b pb-2">Datos de la Mascota</h2>
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm border-b pb-4 mb-6">
        <DataRow label="Nombre" value={data.nombreMascota} />
        <DataRow label="Color" value={data.color} />
        <DataRow label="Edad" value={data.edad} />
        <DataRow label="Peso" value={data.peso} />
        <DataRow label="Especie" value={data.especie} />
        <DataRow label="Tutor" value={data.tutor} />
        <DataRow label="Raza" value={data.raza} />
        <div></div> 
      </div>
      
      <ContentSection title="Diagnóstico" content={data.diagnostico} isList={false} />
     
      <ContentSection title="Tratamiento recomendado" content={data.tratamientoRecomendado} isList={true} /> 
      
     
      <ContentSection title="Orientaciones a su Tutor" content={data.orientacionesTutor} isList={true} />
      
      <ContentSection title="Próxima cita (si es necesario)" content={data.proximaCita} isList={false} />
      
      <div className="flex justify-between items-end mt-12 text-sm pt-4">
             
        <div className="flex flex-col items-center">
           
             <div className="border-t pt-2 mt-4 w-48 text-center">
                <p>Firma y Sello de la Clínica</p>
            </div>
        </div>

        <div className="text-right"> 
          <p className="font-bold text-gray-800">{data.firmaVeterinario}</p>
          <p className="text-gray-600">{data.lugarFecha}</p>
          <p className="text-xs text-gray-500 mt-1">(Veterinario Colegiado)</p>
        </div>
      </div>

    </div>
  );
};

export default FichaTratamiento;