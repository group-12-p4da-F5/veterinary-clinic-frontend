// Configuración base de la API
const API_BASE_URL = "http://localhost:8080/api/v1/appointments";

// Mapeo de tipos entre frontend y backend
const TYPE_MAP = {
  standard: "STANDARD",
  vaccine: "STANDARD", // En tu backend solo hay STANDARD y EMERGENCY
  urgent: "EMERGENCY"
};

const STATUS_MAP = {
  pending: "PENDING",
  attended: "ATTENDED",
  past: "MISSED"
};

/**
 * Obtiene todas las horas disponibles para una fecha específica
 * @param {string} dateISO - Fecha en formato YYYY-MM-DD
 * @returns {Promise<string[]>} Array de horas disponibles (formato HH:mm)
 */
export async function getAvailableHours(dateISO) {
  try {
    const response = await fetch(`${API_BASE_URL}/available/${dateISO}`, {
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const hours = await response.json();
    return hours; // El backend devuelve ["09:00", "09:30", ...]
  } catch (error) {
    console.error("Error al obtener horas disponibles:", error);
    throw error;
  }
}

/**
 * Calcula la cuota diaria basándose en las horas disponibles
 * @param {string} dateISO - Fecha en formato YYYY-MM-DD
 * @returns {Promise<{count: number, limit: number}>}
 */
export async function getDailyQuota(dateISO) {
  try {
    const availableHours = await getAvailableHours(dateISO);
    const limit = 10; // Máximo de citas por día
    const count = limit - availableHours.length; // Citas ocupadas
    return { count, limit };
  } catch (error) {
    console.error("Error al obtener cuota diaria:", error);
    throw error;
  }
}

/**
 * Crea una nueva cita
 * @param {Object} payload - Datos de la cita desde el formulario
 * @returns {Promise<Object>} Cita creada
 */
export async function createAppointment(payload) {
  try {
    // Combinar fecha y hora en LocalDateTime para el backend
    const dateTime = `${payload.date}T${payload.time}:00`;
    
    const dto = {
      dateTime: dateTime,
      type: TYPE_MAP[payload.type] || "STANDARD",
      reason: payload.reason,
      patientId: parseInt(payload.patientId, 10)
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    const createdAppointment = await response.json();
    return createdAppointment;
  } catch (error) {
    console.error("Error al crear cita:", error);
    throw error;
  }
}

/**
 * Obtiene todas las citas (para vista admin)
 * @returns {Promise<Array>}
 */
export async function getAllAppointments() {
  try {
    const response = await fetch(API_BASE_URL, {
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener citas:", error);
    throw error;
  }
}

/**
 * Obtiene las citas de un paciente específico
 * @param {number} patientId - ID del paciente
 * @returns {Promise<Array>}
 */
export async function getAppointmentsByPatient(patientId) {
  try {
    const response = await fetch(`${API_BASE_URL}/patient/${patientId}`, {
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener citas del paciente:", error);
    throw error;
  }
}

/**
 * Elimina una cita
 * @param {number} appointmentId - ID de la cita
 * @returns {Promise<void>}
 */
export async function deleteAppointment(appointmentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${appointmentId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    throw error;
  }
}

/**
 * Actualiza el estado de una cita
 * @param {number} appointmentId - ID de la cita
 * @param {string} newStatus - Nuevo estado (pending, attended, past)
 * @returns {Promise<Object>}
 */
export async function updateAppointmentStatus(appointmentId, newStatus) {
  try {
    const dto = {
      status: STATUS_MAP[newStatus] || "PENDING"
    };

    const response = await fetch(`${API_BASE_URL}/${appointmentId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar estado de cita:", error);
    throw error;
  }
}