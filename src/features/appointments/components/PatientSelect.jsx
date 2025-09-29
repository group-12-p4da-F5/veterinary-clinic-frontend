import { useEffect, useMemo, useRef, useState } from "react";
import { getAllUsers } from "../services/userService";

/**
 * Props:
 *  - value: string (DNI del paciente seleccionado en el form)
 *  - onSelect: (dni: string) => void  // setea patientId en el form
 *  - error?: string                    // mensaje de error del form (si lo hay)
 */
export default function PatientSelect({ value, onSelect, error }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Cargar usuarios desde el backend al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setLoadError("No se pudieron cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sincroniza texto visible al cambiar value
  useEffect(() => {
    const selected = users.find((u) => u.dni === value);
    if (selected) {
      setQuery(`${selected.fullName} (${selected.dni})`);
    } else if (!value) {
      setQuery("");
    }
  }, [value, users]);

  // Filtro por texto
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const fullText = `${u.fullName} ${u.dni} ${u.email || ""}`.toLowerCase();
      return fullText.includes(q);
    });
  }, [query, users]);

  const handleSelect = (user) => {
    onSelect?.(user.dni);
    setQuery(`${user.fullName} (${user.dni})`);
    setOpen(false);
  };

  // Cerrar al hacer click/touch FUERA (pointerdown es más fiable)
  useEffect(() => {
    const closeOnOutside = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  // Cerrar al perder foco del componente completo (por Tab, click fuera, etc.)
  const onInputBlur = () => {
    setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) setOpen(false);
    }, 0);
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Tab") setOpen(false);
  };

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
        onBlur={onInputBlur}
        onKeyDown={onInputKeyDown}
        placeholder={
          loading 
            ? "Cargando pacientes..." 
            : "Busca por nombre o DNI del paciente…"
        }
        disabled={loading}
        className={`w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? "border-orange" : "border-gray"
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? "patientId-error" : undefined}
      />

      {error && (
        <p id="patientId-error" className="mt-1 text-xs text-orange">
          {error}
        </p>
      )}

      {loadError && (
        <p className="mt-1 text-xs text-orange">
          {loadError}
        </p>
      )}

      {open && !loading && (
        <div
          role="listbox"
          className="
            absolute z-50 mt-1 w-full rounded-lg border border-gray bg-white shadow-lg
            overflow-y-auto max-h-48
          "
        >
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">
              {users.length === 0 
                ? "No hay pacientes registrados" 
                : "Sin resultados"}
            </div>
          ) : (
            filtered.map((user) => (
              <button
                key={user.dni}
                type="button"
                // preventDefault en mousedown evita perder foco antes del click
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(user)}
                role="option"
                aria-selected={user.dni === value}
                className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-green-light/40 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium">{user.fullName}</div>
                <div className="text-xs text-gray-500">
                  DNI: {user.dni}
                  {user.email && ` · ${user.email}`}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}