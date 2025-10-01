// PatientsListPage.jsx - Conectado a la API real
import React, { useState, useEffect } from "react";
import { getAllPatients, createPatient, updatePatient, deletePatient } from "../services/patientsService";

const Pencil = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
        <path d="m15 5 4 4"/>
    </svg>
);

const Trash2 = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
);

export default function PatientsListPage() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); 
    const [editingPatient, setEditingPatient] = useState(null);
    const [patientToDelete, setPatientToDelete] = useState(null);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllPatients();
            setPatients(data);
        } catch (err) {
            setError("Error al cargar los pacientes. Por favor, intenta de nuevo.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = () => {
        setEditingPatient(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPatient(null);
        setPatientToDelete(null);
    };

    const handleSavePatient = async (newPatientData) => {
        try {
            const dto = {
                name: newPatientData.name,
                age: parseInt(newPatientData.age, 10) || 0,
                breed: newPatientData.breed || "",
                gender: newPatientData.gender || "",
                ownerDni: newPatientData.ownerDni
            };

            const createdPatient = await createPatient(dto);
            setPatients(prev => [...prev, createdPatient]);
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear paciente:", error);
            throw error;
        }
    };
    
    const handleUpdatePatient = async (updatedPatientData) => {
        try {
            const dto = {
                name: updatedPatientData.name,
                age: parseInt(updatedPatientData.age, 10) || 0,
                breed: updatedPatientData.breed || "",
                gender: updatedPatientData.gender || "",
                ownerDni: updatedPatientData.ownerDni
            };

            const updated = await updatePatient(updatedPatientData.patientId, dto);
            setPatients(prev => prev.map(p => 
                p.patientId === updated.patientId ? updated : p
            ));
            handleCloseModal();
        } catch (error) {
            console.error("Error al actualizar paciente:", error);
            throw error;
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
    };

    const handleDelete = (patient) => {
        setPatientToDelete(patient);
    };
    
    const handleConfirmDelete = async () => {
        if (!patientToDelete) return;
        
        try {
            await deletePatient(patientToDelete.patientId);
            setPatients(prev => prev.filter(p => p.patientId !== patientToDelete.patientId));
            handleCloseModal();
        } catch (error) {
            console.error("Error al eliminar paciente:", error);
            alert("No se pudo eliminar el paciente. Puede que tenga citas o tratamientos asociados.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Gestión de Pacientes</h1>
                <button 
                    onClick={handleOpenModal}
                    className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Crear Nuevo Paciente</span>
                </button>
            </header>

            {error && (
                <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700">
                    {error}
                    <button 
                        onClick={loadPatients}
                        className="ml-4 underline hover:no-underline"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="p-4 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Lista ({patients.length} Pacientes)
                    </h2>
                    
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Cargando pacientes...</div>
                    ) : patients.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No hay pacientes registrados. ¡Crea uno nuevo!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raza</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Edad</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Género</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">DNI Dueño</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patients.map((patient) => (
                                        <tr key={patient.patientId} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{patient.breed || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{patient.age || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{patient.gender || 'N/A'}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{patient.ownerDni}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(patient)}
                                                    className="p-1 text-gray-600 rounded-full hover:bg-gray-100 transition duration-150"
                                                    title="Editar"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
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

            {showModal && !editingPatient && (
                <PatientForm 
                    onClose={handleCloseModal} 
                    onSubmit={handleSavePatient} 
                />
            )}

            {editingPatient && (
                <PatientForm 
                    onClose={handleCloseModal} 
                    onSubmit={handleUpdatePatient}
                    initialData={editingPatient}
                />
            )}

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
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter" onClick={onClose}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-red-300 pb-2 flex items-center">
                    <Trash2 className="text-red-600 mr-2 h-6 w-6"/>
                    Confirmar Eliminación
                </h2>
                <p className="text-gray-700 mb-6">
                    ¿Estás seguro que deseas eliminar permanentemente a <span className="font-semibold text-red-600">{patient.name}</span>? Esta acción no se puede deshacer.
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
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-150 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, type = 'text', required = false, placeholder = '', value, onChange, disabled }) => (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value ?? ''} 
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="w-full rounded-lg border-gray-300 shadow-sm transition duration-150 ease-in-out focus:border-green-600 focus:ring-green-600 focus:ring-2 disabled:opacity-50 px-3 py-2 border"
        />
    </div>
);

const PatientForm = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '',
        breed: '',
        age: '',
        gender: '',
        ownerDni: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.ownerDni) {
            setError("Nombre y DNI del dueño son obligatorios");
            return;
        }

        setIsSaving(true);
        setError(null);
        
        onSubmit(formData)
            .catch(err => {
                setError(err.message || "Error al guardar el paciente");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    return (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter" onClick={onClose}>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
                    {initialData ? 'Editar Paciente' : 'Crear Nuevo Paciente'}
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <FormInput 
                                label="Nombre del Paciente" 
                                name="name" 
                                required={true} 
                                placeholder="Ej: Max"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isSaving}
                            />
                        </div>
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
                        <FormInput 
                            label="Género" 
                            name="gender" 
                            placeholder="Ej: Macho"
                            value={formData.gender}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
                        <FormInput 
                            label="DNI del Dueño" 
                            name="ownerDni" 
                            required={true} 
                            placeholder="Ej: 12345678A"
                            value={formData.ownerDni}
                            onChange={handleChange}
                            disabled={isSaving}
                        />
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
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition duration-150 bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Guardando...' : 'Guardar Paciente'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};