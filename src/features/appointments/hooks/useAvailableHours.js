import { useEffect, useState } from "react";
import { getAvailableHours } from "../services/appointmentService";

/**
 * Hook para obtener las horas disponibles de una fecha específica
 * @param {string} dateISO - Fecha en formato YYYY-MM-DD
 * @returns {Object} { hours: string[], loading: boolean, error: string|null }
 */
export default function useAvailableHours(dateISO) {
  const [state, setState] = useState({
    hours: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    // Si no hay fecha, limpiar estado
    if (!dateISO) {
      setState({ hours: [], loading: false, error: null });
      return;
    }

    // Validar que sea un día laborable (lunes a viernes)
    const date = new Date(dateISO + "T00:00:00");
    const dayOfWeek = date.getDay(); // 0=domingo, 6=sábado
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setState({
        hours: [],
        loading: false,
        error: "Solo se pueden agendar citas de lunes a viernes.",
      });
      return;
    }

    // Cargar horas disponibles
    setState((s) => ({ ...s, loading: true, error: null }));
    
    getAvailableHours(dateISO)
      .then((hours) => {
        if (!cancelled) {
          setState({ hours, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            hours: [],
            loading: false,
            error: "No se pudieron cargar las horas disponibles.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dateISO]);

  return state;
}