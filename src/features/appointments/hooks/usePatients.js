import { useEffect, useRef, useState } from "react";
import { getPatientsByOwner } from "../services/patientsServices";
import { getAllUsers } from "../services/userService";

/**
 * Hook para cargar todos los pacientes con búsqueda local
 */
export default function usePatients(q) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const loadedRef = useRef(false);

  // Cargar todos los pacientes una sola vez
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const fetchAllPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const users = await getAllUsers();
        
        const patientsPromises = users.map((user) =>
          getPatientsByOwner({ dni: user.dni }).catch(() => [])
        );
        
        const patientsArrays = await Promise.all(patientsPromises);
        
        const patients = patientsArrays
          .flat()
          .map((patient) => ({
            ...patient,
            ownerName: users.find((u) => u.dni === patient.ownerDni)?.fullName || "Desconocido",
            species: "Perro/Gato" // Ajusta según tu modelo
          }));
        
        setAllPatients(patients);
        setData(patients);
      } catch (err) {
        console.error("Error al cargar pacientes:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPatients();
  }, []);

  // Filtrar localmente según la query
  useEffect(() => {
    if (!q || q.trim() === "") {
      setData(allPatients);
      return;
    }

    const query = q.trim().toLowerCase();
    const filtered = allPatients.filter((patient) => {
      const searchText = `${patient.name} ${patient.breed} ${patient.species || ""} ${patient.ownerName}`.toLowerCase();
      return searchText.includes(query);
    });
    
    setData(filtered);
  }, [q, allPatients]);

  const reload = async () => {
    loadedRef.current = false;
    setAllPatients([]);
    setData([]);
    
    try {
      setLoading(true);
      setError(null);
      
      const users = await getAllUsers();
      
      const patientsPromises = users.map((user) =>
        getPatientsByOwner({ dni: user.dni }).catch(() => [])
      );
      
      const patientsArrays = await Promise.all(patientsPromises);
      
      const patients = patientsArrays
        .flat()
        .map((patient) => ({
          ...patient,
          ownerName: users.find((u) => u.dni === patient.ownerDni)?.fullName || "Desconocido",
          species: "Perro/Gato"
        }));
      
      setAllPatients(patients);
      setData(patients);
      loadedRef.current = true;
    } catch (err) {
      console.error("Error al recargar pacientes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reload };
}