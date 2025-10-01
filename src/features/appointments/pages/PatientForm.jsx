import { useState } from "react";

/**
 * Componente modal para el formulario de creación de pacientes.
 * Mantiene su propio estado y maneja la validación de entrada.
 *
 * @param {object} props - Propiedades del componente.
 * @param {function} props.onClose - Función para cerrar el modal.
 * @param {function} props.onSubmit - Función a llamar con los datos del paciente al enviar.
 */
export default function PatientForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        ownerName: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setErrorMessage(null);
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'age' ? (value ? parseInt(value, 10) : '') : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación simple
        if (!formData.name.trim() || !formData.species.trim() || !formData.ownerName.trim()) {
            setErrorMessage("Por favor, rellena los campos obligatorios (Nombre, Especie, Dueño).");
            return;
        }

        setIsSubmitting(true);
        try {
            // Llama al prop onSubmit con los datos del formulario
            await onSubmit(formData);
        } catch (error) {
            // Manejo de errores de la API o de la lógica de envío
            setErrorMessage(`Error al guardar: ${error.message || 'Error de red o del servidor.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-green-200 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
            {/* Fondo del modal cambiado a bg-white */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-transform duration-300 scale-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Crear Nuevo Paciente</h2>
                
                {errorMessage && (
                    <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Campo Nombre */}
                        <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Paciente <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                            />
                        </div>

                        {/* Campo Especie */}
                        <div>
                            <label htmlFor="species" className="block text-sm font-medium text-gray-700">Especie <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="species"
                                value={formData.species}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                            />
                        </div>
                        
                        {/* Campo Raza */}
                        <div>
                            <label htmlFor="breed" className="block text-sm font-medium text-gray-700">Raza</label>
                            <input
                                type="text"
                                id="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                            />
                        </div>

                        {/* Campo Edad */}
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad (años)</label>
                            <input
                                type="number"
                                id="age"
                                value={formData.age}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                            />
                        </div>

                        {/* Campo Dueño */}
                        <div>
                            <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Nombre del Dueño <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 hover:bg-orange-700 disabled:bg-orange-400"
                        >
                            {isSubmitting ? (
                                // Spinner SVG
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isSubmitting ? "Guardando..." : "Guardar Paciente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
