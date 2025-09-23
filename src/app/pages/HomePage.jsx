import React from 'react';
import ImgMedicoHomepage from '../../shared/assets/ImgMedicoHomepage.png';
import { FaHeartbeat, FaStethoscope, FaMapMarkerAlt } from 'react-icons/fa';
import PhotoGallery from '../../shared/components/PhotoGallery'; 

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">   
      <section className="flex flex-col md:flex-row justify-center items-start text-center my-8">
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-2">
            <FaHeartbeat className="h-10 w-10 text-gray-700" />
          </div>
          <h3 className="font-cardo">No reinventamos el sistema, solo lo mejoramos. Ofrecemos una atención excepcional, con la misma calidez y dedicación que desearíamos para nuestros propios compañeros peludos. En nuestra clínica, tu mascota es familia..</h3>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-2">
            <FaStethoscope className="h-10 w-10 text-gray-700" />
          </div>
          <h3 className="font-cardo">La excelencia médica que tu mascota merece. Invertimos en equipos de última generación para garantizar que cada paso, desde la prevención hasta la cirugía, se realice con la máxima precisión y seguridad. Porque la tranquilidad de saber que tu mejor amigo está en las mejores manos no tiene precio.</h3>
        </div>
        
        <div className="flex-1 p-4">
          <div className="flex justify-center mb-2">
            <FaMapMarkerAlt className="h-10 w-10 text-gray-700" />
          </div>
          <h3 className="font-cardo">Más que una marca, una promesa de calidad. Brindamos una atención de primera que se refleja en cada detalle, desde el primer saludo hasta el tratamiento más avanzado. Porque cada amigo peludo merece la mejor experiencia de cuidado.</h3>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center my-8">
        <div className="md:w-1/2 p-4">
          <img 
            src={ImgMedicoHomepage} 
            alt="Veterinario examinando un perro" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
         </div>
        <div className="md:w-1/2 p-4 mt-4 md:mt-0">
          <p>Para nosotros, la medicina veterinaria va más allá del tratamiento. Se trata de construir una confianza sólida contigo y tu mascota. Por ello, creemos en un trato personalizado y con empatía, estando siempre aquí para ayudarte, explicarte cada paso y brindarte el apoyo que necesites.</p>
        </div>
      </section>

     
      <section className="text-center my-8">
        <h2 className="text-2xl font-bold mb-4">Nuestros servicios</h2>
        <p>
          Servicios veterinarios completos para el bienestar de tu mascota. Desde consultas de rutina y vacunaciones hasta cirugías avanzadas y cuidados intensivos, ofrecemos un abanico completo de servicios para garantizar la salud y felicidad de tu compañero peludo en cada etapa de su vida.
        </p>
      </section>

      <PhotoGallery />
    </div>
  );
}

export default HomePage;