import { useEffect, useMemo, useRef, useState } from "react";
import { getAllPatients } from "../services/patientsServices";

/**
 * PatientSelect - Desplegable con TODAS las mascotas
 */
export default function PatientSelect({ value, onSelect, error }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allPatients, setAllPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Cargar todas las mascotas al montar
  useEffect(() => {
    let isMounted = true;
    
    const fetchAllPatients = async () => {
      try {
        setLoading(true);
        setLoadError("");
        
        const patients = await getAllPatients();
        
        if (!isMounted) return;
        
        console.log("Mascotas cargadas:", patients.length);
        setAllPatients(patients);
      } catch (err) {
        console.error("Error al cargar mascotas:", err);
        if (isMounted) {
          setLoadError("No se pudieron cargar las mascotas");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllPatients();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const selected = allPatients.find((p) => String(p.patientId) === String(value));
    if (selected) {
      setQuery(`${selected.name} (${selected.breed})`);
    } else if (!value) {
      setQuery("");
    }
  }, [value, allPatients]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPatients;
    return allPatients.filter((p) => {
      const fullText = `${p.name} ${p.breed} ${p.gender}`.toLowerCase();
      return fullText.includes(q);
    });
  }, [query, allPatients]);

  const handleSelect = (patient) => {
    onSelect?.(String(patient.patientId));
    setQuery(`${patient.name} (${patient.breed})`);
    setOpen(false);
  };

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            if (!rootRef.current?.contains(document.activeElement)) {
              setOpen(false);
            }
          }, 200);
        }}
        placeholder={
          loading
            ? "Cargando mascotas..."
            : allPatients.length === 0
            ? "No hay mascotas registradas"
            : "Busca por nombre, raza..."
        }
        disabled={loading}
        className={`w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring disabled:bg-gray-100 ${
          error ? "border-orange" : "border-gray"
        }`}
      />

      {error && <p className="mt-1 text-xs text-orange">{error}</p>}
      {loadError && <p className="mt-1 text-xs text-orange">{loadError}</p>}
      {loading && <p className="mt-1 text-xs text-gray-500">Cargando mascotas...</p>}
      
      {!loading && !error && allPatients.length > 0 && (
        <p className="mt-1 text-xs text-gray-500">
          {allPatients.length} {allPatients.length === 1 ? "mascota" : "mascotas"}
        </p>
      )}

      {open && !loading && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray bg-white shadow-lg overflow-y-auto max-h-60">
          {filtered.map((patient) => (
            <button
              key={patient.patientId}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(patient)}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-green-light/40 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">
                {patient.name} <span className="text-xs text-gray-500">({patient.breed})</span>
              </div>
              <div className="text-xs text-gray-500">
                {patient.gender} · {patient.age} {patient.age === 1 ? "año" : "años"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}