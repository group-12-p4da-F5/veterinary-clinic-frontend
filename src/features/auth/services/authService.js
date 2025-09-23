import axios from 'axios';

const API_URL = "http://localhost:8080/api/v1"
const REGISTER_ENDPOINT = "/register"
const LOGIN_ENDPOINT = "/login"

export const registerService = async (userData) => {
    const response = await axios.post(`${API_URL}${REGISTER_ENDPOINT}`, userData)
      .catch( (err) => {
        throw err.response?.data || {message: 'Error en el registro'} 
      });
    return response.data;
  }

export const loginService = async (userData) => {
  const response = await axios.get(`${API_URL}${LOGIN_ENDPOINT}`, {
    params: userData
  })
    .catch((err) => {
      throw err.response?.data || {message: "Error en el login"}
    });
  return response.data;
}