import { useEffect, useMemo, useRef, useState } from "react";

// Mock local de pacientes (id que guardaremos en el form + etiqueta visible)
const OPTIONS = [
    { id: "p-001", label: "Cookie · Dolores Delano (DNI 12345678A)" },
    { id: "p-002", label: "Mila · Aitor Menta (DNI 22334455B)" },
    { id: "p-003", label: "Rocky · Esteban Dido (DNI 99887766C)" },
    { id: "p-004", label: "Toby · Benito Camelas (DNI 44556677D)" },
    { id: "p-005", label: "Luna · Luz Cuesta Mogollón (DNI 11223344E)" },
];

/**
 * Props:
 *  - value: string (patientId seleccionado en el form)
 *  - onSelect: (id: string) => void  // setea patientId en el form
 *  - error?: string                  // mensaje de error del form (si lo hay)
 */
export default function PatientSelect({ value, onSelect, error }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Sincroniza texto visible al cambiar value
  useEffect(() => {
    const sel = OPTIONS.find((o) => o.id === value);
    setQuery(sel ? sel.label : "");
  }, [value]);

  // Filtro por texto
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return OPTIONS;
    return OPTIONS.filter((o) => o.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (opt) => {
    onSelect?.(opt.id);
    setQuery(opt.label);
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
        placeholder="Busca por nombre/DNI del responsable…"
        className={`w-full rounded-lg border p-2 text-sm focus:outline-none focus:ring ${
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

      {open && (
        <div
          role="listbox"
          className="
            absolute z-50 mt-1 w-full rounded-lg border border-gray bg-white shadow-lg
            overflow-y-auto max-h-36
          "
          style={{ maxHeight: "144px" }} // fallback por si Tailwind no aplica max-h
        >
          {filtered.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">Sin resultados</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                // preventDefault en mousedown evita perder foco antes del click
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={opt.id === value}
                className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-green-light/40"
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
