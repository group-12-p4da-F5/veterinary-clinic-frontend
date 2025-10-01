const API_URL = "http://localhost:8080/api/v1/users";

/**
 * Obtiene todos los usuarios desde el backend
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function getAllUsers() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: No se pudieron cargar los usuarios`
      );
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

/**
 * Busca un usuario por DNI
 * @param {string} dni - DNI del usuario
 * @returns {Promise<Object>} Usuario encontrado
 */
export async function getUserByDni(dni) {
  try {
    const response = await fetch(`${API_URL}/${dni}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: Usuario no encontrado`
      );
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
}