import { useEffect, useMemo, useRef, useState } from "react";

// Mock local de pacientes (id que guardaremos en el form + etiqueta visible)
const OPTIONS = [
  { id: "p-001", label: "Cookie · Ana García (DNI 12345678A)" },
  { id: "p-002", label: "Mila · Luis Pérez (DNI 22334455B)" },
  { id: "p-003", label: "Rocky · Marta Díaz (DNI 99887766C)" },
  { id: "p-004", label: "Toby · Sergio R. (DNI 44556677D)" },
  { id: "p-005", label: "Luna · Paula M. (DNI 11223344E)" },
];

/**
 * Props:
 *  - value: string (patientId seleccionado en el form)
 *  - onSelect: (id: string) => void  // setea patientId en el form
 *  - error?: string                  // mensaje de error del form (si lo hay)
 */
export default function PatientSelect({ value, onSelect, error }) {
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // lo que el usuario escribe/ve

  // Cuando cambia value desde fuera, sincroniza el texto visible
  useEffect(() => {
    const selected = OPTIONS.find(o => o.id === value);
    setQuery(selected ? selected.label : "");
  }, [value]);

  // Filtro simple por texto (label)
  const filtered = useMemo(() => {
    if (!query) return OPTIONS;
    const q = query.toLowerCase();
    return OPTIONS.filter(o => o.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelect = (opt) => {
    onSelect?.(opt.id);     // guardamos el id en el form
    setQuery(opt.label);    // mostramos la etiqueta
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
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
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray bg-white shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">Sin resultados</div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-green-light/40"
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={opt.id === value}
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
