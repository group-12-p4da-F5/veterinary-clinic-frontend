import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Logomargarita from '../assets/Logomargarita.png';

// --------------------------------------------------------------------------------
// Componentes de Ayuda (Ajustados para ser más pequeños)
// --------------------------------------------------------------------------------

const ColumnaFooter = ({ titulo, children, link, onClick }) => (
  <div>
    {/* Título: Cambiado de text-teal-700 a text-gray-900 */}
    <h4 className="text-xl font-extrabold mb-3 text-gray-900">
      {link ? (
        <a href={link} className="hover:underline transition-colors duration-200">
          {titulo}
        </a>
      ) : onClick ? (
        <button onClick={onClick} className="text-xl font-extrabold text-gray-900 hover:underline transition-colors duration-200 focus:outline-none">
          {titulo}
        </button>
      ) : (
        titulo
      )}
    </h4>
    {children}
  </div>
);

const ItemContacto = ({ icono, texto }) => (
  // El texto es oscuro (gray-700) para contraste, con hover al color de acento (teal-900)
  <li className="flex items-start text-gray-700 hover:text-teal-900 transition-colors">
    {/* Iconos: Cambiado de text-teal-700 a text-gray-700 */}
    <span className="mr-3 text-gray-700 w-4 h-4 flex items-center justify-center pt-1">
      <FontAwesomeIcon icon={icono} />
    </span>
    {/* Aseguramos el tamaño de texto pequeño */}
    <span className="flex-1 text-sm">{texto}</span>
  </li>
);

const ItemFooter = ({ children, link }) => (
  // Los ítems de la lista también son oscuros, con hover para resaltar. Aseguramos tamaño pequeño.
  <li className="text-sm text-gray-700 hover:text-teal-900 transition-colors">
    {link ? <a href={link}>{children}</a> : <span>{children}</span>}
  </li>
);


const IconosSociales = () => (
  // CORRECCIÓN DE ERROR: Movemos el comentario dentro del div para resolver el error de sintaxis.
  <div className="flex space-x-4 mt-4">
    {/* Íconos Sociales: Cambiado de text-teal-700 a text-gray-700 */}
    <a href="https://www.facebook.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110">
      <FontAwesomeIcon icon={faFacebookF} size="lg" />
    </a>
    <a href="https://www.instagram.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110">
      <FontAwesomeIcon icon={faInstagram} size="lg" />
    </a>
    <a href="https://www.twitter.com/MargaritaVetClinic" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 transform hover:scale-110">
      <FontAwesomeIcon icon={faTwitter} size="lg" />
    </a>
  </div>
);

// Los componentes ContactForm y WorkWithUsModal se mantienen
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

// --------------------------------------------------------------------------------
// Componente Principal Footer (COMPACTADO)
// --------------------------------------------------------------------------------

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    // CLAVE 1: Reducimos el padding vertical principal de py-12 a py-8
    <footer className="bg-green-200 text-teal-700 py-8 px-4">
      {/* CLAVE 2: Reducimos el espacio entre columnas de gap-12 a gap-8. Reducimos pb-10 a pb-6. */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-green-300 pb-6">
      
        <ColumnaFooter titulo="Quiénes somos" link="/quienes-somos">
          <p className="text-sm leading-relaxed text-gray-700">
            En el Centro Veterinario Margarita, nos especializamos en la salud y bienestar de mascotas.
            Diagnósticos avanzados y tratamientos personalizados para cada paciente, siempre utilizando las últimas
            tecnologías en radiología, ecografía y análisis clínicos.
          </p>
        </ColumnaFooter>

        <ColumnaFooter titulo="Servicios" link="/servicios">
          {/* CLAVE 3: Reducimos el espacio entre ítems de space-y-3 a space-y-2 */}
          <ul className="space-y-2"> 
            <ItemFooter link="/servicios#vacunacion">Vacunación para Mascotas</ItemFooter>
            <ItemFooter link="/servicios#analisis">Análisis Clínicos</ItemFooter>
            <ItemFooter link="/servicios#ecografias">Ecografías Veterinarias</ItemFooter>
            <ItemFooter link="/servicios#cirugia">Cirugía Veterinaria</ItemFooter>
            <ItemFooter link="/servicios#microchips">Microchips para Mascotas</ItemFooter>
          </ul>
        </ColumnaFooter>

        <ColumnaFooter titulo="Contacto" link="/contacto">
          {/* CLAVE 3: Reducimos el espacio entre ítems de space-y-3 a space-y-2 */}
          <ul className="space-y-2">
            <ItemContacto icono={faMapMarkerAlt} texto="Calle Catalunya 123 4a Gijón, Asturias" />
            <ItemContacto icono={faEnvelope} texto="margaritavetclinic@gmail.com" />
            <ItemContacto icono={faPhone} texto="+1 386-689-3295" />
            <ItemContacto icono={faClock} texto="Lunes-Viernes de 10 a 13:30h y de 16:30 a 20h" />
          </ul>
        </ColumnaFooter>

        <div className="flex flex-col justify-between">
          <ColumnaFooter titulo="Trabaja con nosotros" onClick={handleOpenModal}>
            <p className="text-sm mb-4 leading-relaxed text-gray-700">
              Forma parte del equipo Margarita Clínica Veterinaria y crece con nosotros.
            </p>
            <IconosSociales />
          </ColumnaFooter>
          {/* CLAVE 4: Reducimos el margen superior de mt-6 a mt-4 */}
          <div className="mt-4 flex justify-start md:justify-end"> 
            <img
              src={Logomargarita}
              alt="Clínica Veterinaria Margarita Logo"
              // CLAVE 5: Reducimos el tamaño del logo de h-16 a h-12
              className="h-12 opacity-100" 
            />
          </div>
        </div>
      </div>

      {/* CLAVE 6: Reducimos el margen y padding superior de mt-8 pt-4 a mt-4 pt-2 */}
      {/* El texto de copyright ya estaba en teal-700, lo cambiamos a gray-700 para mantener el estilo */}
      <div className="mt-4 pt-2 text-center text-xs text-gray-700">
        <p>© {new Date().getFullYear()} Clínica Veterinaria Margarita. Todos los derechos reservados.</p>
      </div>
      
      <WorkWithUsModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </footer>
  );
};

export default Footer;
