import axios from 'axios';
import { encodeBase64 } from './encrypt';
import API_URL from '../../../app/apis/apiClinic';

const REGISTER_ENDPOINT = "register"
const LOGIN_ENDPOINT = "login"

export const registerService = async (userData) => {
  const encodedData = {
    ...userData,
    dni: encodeBase64(userData.dni),
    password: encodeBase64(userData.password),
  };

  const response = await axios.post(`${API_URL}/${REGISTER_ENDPOINT}`, encodedData)
    .catch( (err) => {
      throw err.response?.data || {message: 'Error en el registro'} 
    });

  return response.data;
}

export const loginService = async (userData) => {
  const encodedData = {
    ...userData,
    dni: encodeBase64(userData.dni),
    password: encodeBase64(userData.password),
  };

  const response = await axios.get(`${API_URL}/${LOGIN_ENDPOINT}`, {
    params: encodedData,
  })
    .catch((err) => {
      throw err.response?.data || {message: "Error en el login"}
    });

  return response.data;
}