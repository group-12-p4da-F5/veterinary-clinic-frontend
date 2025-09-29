import axios from 'axios';
import { encodeBase64 } from './encrypt';
import API_URL from '../../../app/apis/apiClinic';

const REGISTER_ENDPOINT = "register";
const LOGIN_ENDPOINT = "login";

// Registrar user
export const registerService = async (userData) => {
  const encodedData = {
    ...userData,
    dni: encodeBase64(userData.dni),
    password: encodeBase64(userData.password),
  };

  const response = await axios.post(`${API_URL}/${REGISTER_ENDPOINT}`, encodedData)
    .catch(err => {
      throw err.response?.data || { message: 'Error en el registro' };
    });

  return response.data;
};

// Login user
export const loginService = async (userData) => {

  const credentials = btoa(`${userData.dni}:${userData.password}`);
  try {
    const response = await axios.get(`${API_URL}/${LOGIN_ENDPOINT}`, {
      headers: {
        'Authorization': `Basic ${credentials}`
      },
      withCredentials: true 
    });

    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw { message: "Credenciales incorrectas" };
    }
    throw { message: "Error en el login" };
  }
};

export const logoutService = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return { message: "Logged out" };
  } catch (err) {
    console.error("Error en logout:", err);
    throw { message: "Error en logout" };
  }
};