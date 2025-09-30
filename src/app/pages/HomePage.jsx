import React from 'react';
import ImgMedicoHomepage from '../../shared/assets/ImgMedicoHomepage.png';
// Usamos íconos de la librería Fa para un look consistente
import { FaPaw, FaMicroscope, FaClinicMedical } from 'react-icons/fa'; 
import PhotoGallery from '../../shared/components/PhotoGallery'; 

function HomePage() {
  return (
    // Se mantiene el fondo blanco puro y el padding.
    <div className="container mx-auto px-4 py-5 bg-white"> 

      {/* ================================================================================
        SECCIÓN 1: VALORES (3 PUNTOS) - Diseño Asimétrico con VERDE CLARO
        ================================================================================
      */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 mb-20">
        
        {/* Tarjeta 1: Calidez y Familia - AHORA con VERDE VIBRANTE (Claro) */}
        <div className="p-8 bg-green-200 rounded-2xl shadow-xl transform hover:scale-[1.05] transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            {/* Ícono en blanco para contraste */}
            <FaPaw className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">
            Tu mascota es familia.
          </h3>
          {/* Texto en un verde muy claro para legibilidad */}
          <p className="text-lg text-black">
            Atención excepcional con la misma calidez y dedicación que desearíamos para nuestros propios compañeros.
          </p>
        </div>
        
        {/* Tarjeta 2: Excelencia Médica - Mantenemos el acento NARANJA */}
        <div className="p-8 bg-gray-200 border-4 border-orange-300 rounded-2xl shadow-2xl transform hover:scale-[1.05] transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            <FaMicroscope className="h-10 w-10 text-orange-500" /> 
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Excelencia sin límites.
          </h3>
          <p className="text-lg text-gray-600">
            Invertimos en equipos de última generación para garantizar precisión, desde la prevención hasta la cirugía.
          </p>
        </div>
        
        {/* Tarjeta 3: Compromiso de Calidad - AHORA con VERDE MEDIO (Claro) */}
        <div className="p-8 bg-green-200 rounded-2xl shadow-xl transform hover:scale-[1.05] transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            {/* Ícono en blanco para contraste */}
            <FaClinicMedical className="h-10 w-10 text-gray-500" /> 
          </div>
          <h3 className="text-2xl font-bold text-gray-500 mb-4">
            Promesa de calidad.
          </h3>
          {/* Texto en blanco (o gris muy claro) para legibilidad */}
          <p className="text-lg text-black">
            Más que una marca, un compromiso que se refleja en cada detalle. Cada amigo peludo merece la mejor experiencia.
          </p>
        </div>
      </section>

      {/* ================================================================================
        SECCIÓN 2: VETERINARIO & FILOSOFÍA - Ajustamos el color del borde y acento
        ================================================================================
      */}
      <section className="flex flex-col md:flex-row items-center my-32 bg-gray-50 p-8 md:p-20 rounded-3xl shadow-xl border-t-8 border-orange-300">
        
        <div className="md:w-1/2 p-4 order-2 md:order-1">
          {/* El borde lateral del título usa el color de marca (green-500) */}
          <h2 className="text-5xl font-black text-gray-900 mb-6 border-l-4 border-green-00 pl-4 leading-tight">
            Nuestra Filosofía: Confianza y Empatía.
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            Para nosotros, la medicina veterinaria va más allá. Se trata de construir una **confianza sólida** contigo y tu mascota. Creemos en un trato personalizado y con empatía, explicando cada paso y brindándote el apoyo que necesitas.
          </p>
        </div>
        
        <div className="md:w-1/2 p-4 order-1 md:order-2">
          <img 
            src={ImgMedicoHomepage} 
            alt="Veterinario examinando un perro" 
            className="w-full h-auto rounded-tl-3xl rounded-br-3xl shadow-2xl border-4 border-white transform rotate-1"
          />
        </div>
      </section>

      {/* ================================================================================
        SECCIÓN 3: INTRODUCCIÓN A SERVICIOS - Título de impacto
        ================================================================================
      */}
      <section className="text-center my-20">
        {/* El título principal usa el color de marca (green-500) */}
         <h2 className="text-6xl md:text-5xl font- text-gray-400 mb-6 tracking-tight leading-none">
          Nuestros <span className="text-green-400 underline">Servicios</span>
        </h2>
        
        <p className="max-w-4xl mx-auto text-xl text-gray-600 px-4 mb-8">
          Servicios veterinarios completos para el bienestar de tu mascota. Desde consultas de rutina y vacunaciones hasta cirugías avanzadas y cuidados intensivos, garantizamos la salud y felicidad de tu compañero peludo.
        </p>
      </section>

      <PhotoGallery />
    </div>
  );
}

export default HomePage;