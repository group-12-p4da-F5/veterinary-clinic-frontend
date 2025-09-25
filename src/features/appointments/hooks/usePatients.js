import { useEffect, useRef, useState } from "react";
import { getPatients } from "../services/patientsServices";

/**
 * Hook de datos con debounce + cancelación:
 * - Debounce ~300ms para no spamear la API mientras el usuario escribe.
 * - AbortController para cancelar la petición anterior si cambia 'q'.
 * - Devuelve { data, loading, error }.
 */
export default function usePatients(q) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    // Debounce: espera 300ms desde la última tecla
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Cancela petición previa (si la había)
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const rows = await getPatients({ q, signal: ctrl.signal });
        if (!ctrl.signal.aborted) setData(rows);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 300);

    // Cleanup: limpia el timeout y aborta la última petición
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [q]);

  return { data, loading, error };
}
