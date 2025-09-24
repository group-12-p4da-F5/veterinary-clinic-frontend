import API_URL from "./apiClinic";
import getAuthHeaders from "../helper/getAuthtoken";
import axios from 'axios';

const APPOINTMENT_ENDPOINT = "appointments";

export const getAllAppointments = async () => {
  const response = await axios.get(`${API_URL}/${APPOINTMENT_ENDPOINT}`, getAuthHeaders())
    .catch((err) => {
      throw err?.response?.data || {message: "Error de usuarios"}
    })

  return response.data;
}

