// MOCK local para desarrollo (borrar cuando haya backend)
const MOCK = [
    { id: "p-001", name: "Cookie", species: "Perro", breed: "Beagle", age: 5, ownerName: "Ana García" },
    { id: "p-002", name: "Mila", species: "Gato", breed: "Siamés", age: 3, ownerName: "Luis Pérez" },
    { id: "p-003", name: "Rocky", species: "Perro", breed: "Pastor", age: 7, ownerName: "Marta Díaz" },
];

//(TEST): variable módulo para fallar solo una vez
let _failOnce = true;

/**
 * Obtiene pacientes del servidor (o del MOCK mientras no haya backend).
 * @param {{ q?: string, signal?: AbortSignal }} params
 * @returns {Promise<Array>}
 */
export async function getPatients({ q = "", signal } = {}) {
    // ================== CONEXIÓN REAL A API (DESCOMENTAR CUANDO ESTÉ LISTA) ==================
    // try {
    //   const url = `/api/patients?q=${encodeURIComponent(q)}`;
    //   const res = await fetch(url, { signal });
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
    //   // La API debería devolver un array de pacientes con: id, name, species, breed, age, ownerName
    //   const data = await res.json();
    //   return Array.isArray(data) ? data : [];
    // } catch (err) {
    //   // Importante: si es una abort, relanzamos para que el hook la identifique
    //   if (err.name === "AbortError") throw err;
    //   // Mientras no haya backend o si falla, decidir relanzar o devolver []
    //   throw err;
    // }
    // =========================================================================================

    // --- Fallback MOCK (eliminar cuando este la API) ---
    await new Promise((r) => setTimeout(r, 500)); // latencia simulada

    //(TEST): simula un error la PRIMERA llamada para probar la UI y el botón Reintentar
    if (_failOnce) {
        _failOnce = false;
        throw new Error("Simulación de fallo (solo 1 vez para pruebas)");
    }
    const term = q.trim().toLowerCase();
    if (!term) return MOCK;
    return MOCK.filter((r) =>
        [r.name, r.species, r.breed, r.ownerName]
            .filter(Boolean)
            .some((v) => v.toLowerCase().includes(term))
    );

     if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  return list;
}
