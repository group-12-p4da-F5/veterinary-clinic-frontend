import { useEffect, useState } from "react";
import { getDailyQuota } from "../services/appointmentService";

export default function useDailyQuota(dateISO) {
  const [state, setState] = useState({
    count: 0,
    limit: 10,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!dateISO) {
      setState(s => ({ ...s, loading: false, error: null }));
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));
    getDailyQuota(dateISO)
      .then(({ count, limit }) => {
        if (!cancelled) setState({ count, limit, loading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: "No se pudo comprobar el cupo." }));
      });

    return () => { cancelled = true; };
  }, [dateISO]);

  const quotaFull = state.count >= state.limit;

  return { ...state, quotaFull };
}
