import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Logomargarita from '../assets/Logomargarita.png';

// Componente para una columna del footer.
const ColumnaFooter = ({ titulo, children, link, onClick }) => (
 <div>
  <h4 className="text-black text-lg font-bold mb-4">
   {link ? (
    <a href={link} className="hover:underline">
     {titulo}
    </a>
   ) : onClick ? (
    <button onClick={onClick} className="text-black text-lg font-bold hover:underline focus:outline-none">
     {titulo}
    </button>
   ) : (
    titulo
   )}
  </h4>
  {children}
 </div>
);

// Componente para un ítem de contacto.
const ItemContacto = ({ icono, texto }) => (
 <li className="flex items-center">
  <span className="mr-2 text-gray-900 w-5 h-5 flex items-center justify-center">
   <FontAwesomeIcon icon={icono} />
  </span>
  <span>{texto}</span>
 </li>
);

// Componente para los enlaces de servicio.
const ItemFooter = ({ children }) => (
 <li>
  {children}
 </li>
);

// Componente para los íconos de redes sociales.
const IconosSociales = () => (
 <div className="flex space-x-4 mt-6">
  <a href="https://www.facebook.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
   <FontAwesomeIcon icon={faFacebookF} size="lg" />
  </a>
  <a href="https://www.instagram.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
   <FontAwesomeIcon icon={faInstagram} size="lg" />
  </a>
  <a href="https://www.twitter.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
   <FontAwesomeIcon icon={faTwitter} size="lg" />
  </a>
 </div>
);

export const ContactForm = ({ onClose }) => {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
 });
 const [successMessage, setSuccessMessage] = useState(null);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prevState => ({
   ...prevState,
   [name]: value
  }));
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  console.log('Formulario enviado:', formData);

  
  setSuccessMessage('¡Gracias por tu interés! En el Centro Veterinario Margarita valoramos tu solicitud y la revisaremos pronto.');
 };

 return (
  <>
   {successMessage ? (
    <div className="text-center p-4">
     <p className="text-gray-600 font-semibold text-lg">{successMessage}</p>
     <button
      type="button"
      onClick={onClose}
      className="mt-6 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
     >
      Cerrar
     </button>
    </div>
   ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
     <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
      <input
       type="text"
       id="name"
       name="name"
       value={formData.name}
       onChange={handleChange}
       required
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      />
     </div>
     <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
      <input
       type="email"
       id="email"
       name="email"
       value={formData.email}
       onChange={handleChange}
       required
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      />
     </div>
     <div>
      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje / CV</label>
      <textarea
       id="message"
       name="message"
       rows="4"
       value={formData.message}
       onChange={handleChange}
       required
       className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      ></textarea>
     </div>
     <div className="flex justify-between items-center pt-4">
      <button
       type="button"
       onClick={onClose}
       className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
       Cancelar
      </button>
      <button
       type="submit"
       className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
       Enviar
      </button>
     </div>
    </form>
   )}
  </>
 );
};

// Componente del Modal (usa ContactForm)
const WorkWithUsModal = ({ isOpen, onClose }) => {
 if (!isOpen) return null;

 return (
  <div className="fixed inset-0 bg-green-200 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
   <div className="relative p-8 bg-white w-96 max-w-sm m-4 rounded-lg shadow-xl">
    <div className="flex justify-center mb-6">
      <img src={Logomargarita} alt="Logo de la Clínica Margarita" className="h-20" />
    </div>

    <div className="text-center">
     <h3 className="text-xl font-bold text-gray-900 mb-4">Formulario de Contacto</h3>
    </div>
    <ContactForm onClose={onClose} />
   </div>
  </div>
 );
};

const Footer = () => {
 const [isModalOpen, setIsModalOpen] = useState(false);

 const handleOpenModal = () => setIsModalOpen(true);
 const handleCloseModal = () => setIsModalOpen(false);

 return (
  <footer className="bg-green-200 text-black py-2 px-2">
   <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

    <ColumnaFooter titulo="Quiénes somos" link="/quienes-somos">
     <p className="text-sm leading-relaxed text-gray-600">
      En el Centro Veterinario Margarita, nos especializamos en la salud y bienestar de mascotas.
      Diagnósticos avanzados y tratamientos personalizados para cada paciente, siempre utilizando las últimas
      tecnologías en radiología, ecografía y análisis clínicos.
     </p>
    </ColumnaFooter>

    <ColumnaFooter titulo="Servicios" link="/servicios">
     <ul className="space-y-2 text-sm text-gray-600">
      <ItemFooter>Vacunación para Mascotas</ItemFooter>
      <ItemFooter>Análisis Clínicos</ItemFooter>
      <ItemFooter>Ecografías Veterinarias</ItemFooter>
      <ItemFooter>Cirugía Veterinaria</ItemFooter>
      <ItemFooter>Microchips para Mascotas</ItemFooter>
     </ul>
    </ColumnaFooter>

    <ColumnaFooter titulo="Contacto" link="/contacto">
     <ul className="space-y-2 text-sm text-gray-600">
      <ItemContacto icono={faMapMarkerAlt} texto="Calle Catalunya 123 4a Gijón, Asturias" />
      <ItemContacto icono={faEnvelope} texto="margaritavetclinic@gmail.com" />
      <ItemContacto icono={faPhone} texto="+1 386-689-3295" />
      <ItemContacto icono={faClock} texto="Lunes-Viernes de 10 a 13:30h y de 16:30 a 20h" />
     </ul>
    </ColumnaFooter>

    <ColumnaFooter titulo="Trabaja con nosotros" onClick={handleOpenModal}>
     <p className="text-sm mb-4 leading-relaxed text-gray-600">
      Forma parte del equipo Margarita Clínica Veterinaria y crece con nosotros.
     </p>
     <IconosSociales />
     <div className="mt-8 flex justify-end">
      <img
       src={Logomargarita}
       alt="Clínica Veterinaria Margarita Logo"
       className="h-20 opacity-75"
      />
     </div>
    </ColumnaFooter>
   </div>

   <div className="mt-10 pt-6 text-center text-xs text-gray-400">
    <p>© {new Date().getFullYear()} Clínica Veterinaria Margarita. Todos los derechos reservados.</p>
   </div>
   
   {/* El modal se renderiza aquí */}
   <WorkWithUsModal isOpen={isModalOpen} onClose={handleCloseModal} />
  </footer>
 );
};

export default Footer;