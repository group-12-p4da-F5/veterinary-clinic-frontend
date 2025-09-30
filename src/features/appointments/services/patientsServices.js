    // services/patientsServices.js
    const API_BASE_URL = "http://localhost:8080/api/v1/patients";

    /**
     * Obtiene todas las mascotas de un dueño por su DNI
     * @param {Object} params - { dni: string, signal?: AbortSignal }
     * @returns {Promise<Array>} Array de PatientDTO
     */
    export async function getPatientsByOwner({ dni, signal }) {
    if (!dni || dni.trim().length === 0) {
        return [];
    }

    try {
        const response = await fetch(`${API_BASE_URL}/owner/${dni}`, {
        credentials: "include",
        signal
        });
        
        if (!response.ok) {
        // Si es 404, simplemente no tiene mascotas
        if (response.status === 404) {
            return [];
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === "AbortError") {
        throw error;
        }
        console.error("Error al obtener mascotas del dueño:", error);
        throw error;
    }
    }

    /**
     * Obtiene un paciente por su ID
     * @param {number} id - ID del paciente
     * @returns {Promise<Object>} PatientDTO
     */
    export async function getPatientById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
        credentials: "include"
        });
        
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error al obtener paciente:", error);
        throw error;
    }
    }
    /**
 * Obtiene TODAS las mascotas registradas
 * @returns {Promise<Array>} Array de PatientDTO
 */
export async function getAllPatients() {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      credentials: "include"
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error al obtener todas las mascotas:", error);
    throw error;
  }
}