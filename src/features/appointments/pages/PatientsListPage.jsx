import React, { useState, useEffect } from "react";
// LÍNEA ELIMINADA: Ya no necesitamos importar PatientForm porque está definido más abajo en este mismo archivo.

// Definiciones de iconos SVG para la tabla
const Pencil = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        <path d="m15 5 4 4"/>
    </svg>
);

const Trash2 = (props) => (
    // Ícono de papelera
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
);

/**
 * Componente principal para la página de la lista de pacientes.
 * Maneja el listado de pacientes.
 */
export default function PatientsListPage() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // showModal es para CREAR un nuevo paciente
    const [showModal, setShowModal] = useState(false); 
    // new states for Edit/Delete actions
    const [editingPatient, setEditingPatient] = useState(null); // Almacena el paciente a editar
    const [patientToDelete, setPatientToDelete] = useState(null); // Almacena el paciente a eliminar

    // Mock data para simular una lista de pacientes
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setPatients([
                { id: 1, name: "Max", species: "Perro", breed: "Golden", age: 5, ownerName: "Ana López" },
                { id: 2, name: "Luna", species: "Gato", breed: "Siamesa", age: 2, ownerName: "Juan Pérez" },
                { id: 3, name: "Rocky", species: "Tortuga", breed: "Galápagos", age: 10, ownerName: "María García" },
            ]);
            setIsLoading(false);
        }, 1000);
    }, [setPatients]);

    // Simulamos las funciones que manejarían la apertura/cierre de modales
    const handleOpenModal = () => {
        setEditingPatient(null); // Asegura que no estemos en modo edición
        setShowModal(true); // Abre modal para nuevo paciente
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPatient(null); // Cierra el modal de edición
        setPatientToDelete(null); // Cierra el modal de confirmación
    };

    /**
     * Función que maneja la lógica de guardar un nuevo paciente (simulada)
     * @param {object} newPatientData - Datos del paciente a guardar.
     */
    const handleSavePatient = async (newPatientData) => {
        console.log("Datos a guardar:", newPatientData);
        
        // Simulación de una operación de guardado
        return new Promise(resolve => {
            setTimeout(() => {
                // Generar un ID único simple
                const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
                const patientWithId = { ...newPatientData, id: newId };
                setPatients(prev => [...prev, patientWithId]);
                handleCloseModal();
                resolve();
            }, 500);
        });
    };
    
    /**
     * Función que maneja la lógica de actualizar un paciente existente (simulada)
     * @param {object} updatedPatientData - Datos del paciente actualizado (debe contener ID).
     */
    const handleUpdatePatient = async (updatedPatientData) => {
        console.log("Datos a actualizar:", updatedPatientData);

        return new Promise(resolve => {
            setTimeout(() => {
                setPatients(prev => prev.map(p => 
                    p.id === updatedPatientData.id ? updatedPatientData : p
                ));
                handleCloseModal();
                resolve();
            }, 500);
        });
    };


    // Funciones de acción para abrir modales específicos
    const handleEdit = (patient) => {
        console.log(`Abriendo modal de edición para paciente con ID: ${patient.id}`);
        setEditingPatient(patient);
    };

    const handleDelete = (patient) => {
        console.log(`Abriendo modal de confirmación para eliminar paciente con ID: ${patient.id}`);
        setPatientToDelete(patient);
    };
    
    /**
     * Función que maneja la eliminación confirmada de un paciente (simulada)
     */
    const handleConfirmDelete = async () => {
        if (!patientToDelete) return;
        console.log(`Eliminando paciente con ID: ${patientToDelete.id}`);

        // Simulación de eliminación
        return new Promise(resolve => {
            setTimeout(() => {
                setPatients(prev => prev.filter(p => p.id !== patientToDelete.id));
                handleCloseModal();
                resolve();
            }, 500);
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Pacientes</h1>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                >
                    {/* Icono + */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Crear Nuevo Paciente</span>
                </button>
            </header>

            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Lista ({patients.length} Pacientes)</h2>
                    
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Cargando pacientes...</div>
                    ) : patients.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No hay pacientes registrados. ¡Crea uno nuevo!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especie</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Edad</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Dueño</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.species}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.breed || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{patient.age || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{patient.ownerName}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                                {/* Botón Editar con icono - Ahora llama a handleEdit con el objeto paciente */}
                                                <button 
                                                    onClick={() => handleEdit(patient)}
                                                    className="p-1 text-gray-600 rounded-full hover:bg-gray-100 transition duration-150"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                {/* Botón Eliminar con icono - Ahora llama a handleDelete con el objeto paciente */}
                                                <button 
                                                    onClick={() => handleDelete(patient)}
                                                    className="p-1 text-red-600 rounded-full hover:bg-red-100 transition duration-150"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Ahora renderizamos los modales */}
            
            {/* Modal de CREACIÓN (si showModal es true Y NO estamos editando) */}
            {showModal && !editingPatient && (
                <PatientForm 
                    onClose={handleCloseModal} 
                    onSubmit={handleSavePatient} 
                />
            )}

            {/* Modal de EDICIÓN (si editingPatient tiene datos) */}
            {editingPatient && (
                <PatientForm 
                    onClose={handleCloseModal} 
                    onSubmit={handleUpdatePatient}
                    initialData={editingPatient}
                />
            )}

            {/* Modal de ELIMINACIÓN (si patientToDelete tiene datos) */}
            {patientToDelete && (
                <ConfirmationModal
                    patient={patientToDelete}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                />
            )}
            
        </div>
    );
}

// ==============================================================================
// Componente Modal de Confirmación para eliminar.
// ==============================================================================

const ConfirmationModal = ({ patient, onConfirm, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-80 p-4 font-inter" onClick={onClose}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-red-300 pb-2 flex items-center">
                    <Trash2 className="text-red-600 mr-2 h-6 w-6"/>
                    Confirmar Eliminación
                </h2>
                <p className="text-gray-700 mb-6">
                    ¿Estás seguro que deseas eliminar permanentemente al paciente <span className="font-semibold text-red-600">{patient.name}</span>? Esta acción no se puede deshacer.
                </p>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-150 
                                   bg-gray-600 hover:bg-red-700 
                                   focus:outline-none focus:ring-4 focus:ring-red-500/50 
                                   disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// ==============================================================================
// Componente Input reutilizable (MOVEMOS ESTO FUERA de PatientForm para corregir el foco)
// ==============================================================================
const FormInput = ({ label, name, type = 'text', required = false, placeholder = '', value, onChange, disabled }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            // Aseguramos que el valor sea una cadena vacía si es nulo
            value={value ?? ''} 
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full rounded-lg border-gray-300 shadow-sm transition duration-150 ease-in-out 
                       focus:border-green-600 focus:ring-green-600 focus:ring-2 disabled:opacity-50"
        />
    </div>
);



const PatientForm = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        species: '',
        breed: '',
        age: '',
        ownerName: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple validación
        if (!formData.name || !formData.species || !formData.ownerName) {
            console.error("Faltan campos obligatorios");
            // En una app real, mostrarías un mensaje de error al usuario.
            return;
        }

        setIsSaving(true);
        try {
            // Si hay initialData, asumimos que estamos editando y conservamos el ID.
            const dataToSubmit = initialData ? { ...formData, id: initialData.id } : formData;
            await onSubmit(dataToSubmit);
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
      
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter" onClick={onClose}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl w-full transform transition-all duration-300 scale-100 opacity-100" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                    {initialData ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            {/* Usamos el componente FormInput externo y le pasamos las props */}
                            <FormInput 
                                label="Nombre del Paciente" 
                                name="name" 
                                required={true} 
                                placeholder="Ej: Fido"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                        <FormInput 
                            label="Especie" 
                            name="species" 
                            required={true} 
                            placeholder="Ej: Perro"
                            value={formData.species}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <FormInput 
                            label="Raza" 
                            name="breed" 
                            placeholder="Ej: Labrador"
                            value={formData.breed}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <FormInput 
                            label="Edad (años)" 
                            name="age" 
                            type="number" 
                            placeholder="Ej: 3"
                            value={formData.age}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <div className="sm:col-span-2">
                            <FormInput 
                                label="Nombre del Dueño" 
                                name="ownerName" 
                                required={true} 
                                placeholder="Ej: Laura Martínez"
                                value={formData.ownerName}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                       
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-150 
                                       bg-orange-600 hover:bg-orange-700 
                                       focus:outline-none focus:ring-4 focus:ring-orange-500/50 
                                       disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
