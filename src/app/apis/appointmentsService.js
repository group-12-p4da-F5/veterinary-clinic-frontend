import API_URL from "./apiClinic";
import getAuthHeaders from "../helper/getAuthtoken";
import axios from 'axios';

const APPOINTMENT_ENDPOINT = "appointments";

export const getAllAppointments = async () => {
  const response = await axios.get(`${API_URL}/${APPOINTMENT_ENDPOINT}`, getAuthHeaders())
    .catch((err) => {
      throw err?.response?.data || {message: "Error al obtener las citas"}
    })

  return response.data;
}

export const getAppointmentsByPatient = async (id) => {
  const response = await axios.get(`${API_URL}/${APPOINTMENT_ENDPOINT}/patient/${id}`, getAuthHeaders())
    .catch((err) => {
      throw err?.response?.data || { message: err.message || "Error al obtener citas del paciente" };
    })

  return response.data;
}

export const createAppointment = async (appointmentData) => {
    const response = await axios.post(`${API_URL}/${APPOINTMENT_ENDPOINT}`, appointmentData, getAuthHeaders())
    .catch((err) => {
      throw err?.response?.data || { message: err.message || "Error al crear la cita" };
    })

  return response.data;
}

export const deleteAppointment = async (id) => {
    const response = await axios.post(`${API_URL}/${APPOINTMENT_ENDPOINT}/${id}`, getAuthHeaders())
    .catch((err) => {
      throw err?.response?.data || { message: err.message || "Error al eliminar cita" };
    })

  return response.data;
}

export const updateAppointmentStatus = async (id, statusData) => {
  const response = await axios.patch(`${API_URL}/${APPOINTMENT_ENDPOINT}/${id}/status`, statusData, getAuthHeaders())
    .catch ((err) => {
      throw err?.response?.data || { message: err.message || "Error al actualizar cita" };
    })

  return response.data;
};

export const getAvailableAppointments = async (date) => {
  const response = await axios.get(`${API_URL}/${APPOINTMENT_ENDPOINT}/available/${date}`, getAuthHeaders())
    .catch ((err) => {
      throw err?.response?.data || { message: err.message || "Error al obtener citas disponibles" };
    })
  return response.data;
};