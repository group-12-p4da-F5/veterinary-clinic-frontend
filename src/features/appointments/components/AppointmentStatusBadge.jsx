export default function AppointmentStatusBadge({ value }) {
  const colorByStatus = {
    pending:  "bg-orange text-white",
    attended: "bg-green-dark text-gray-dark",
    past:     "bg-gray text-gray-dark",
  };

  const labelByStatus = {
    pending:  "Pendiente",
    attended: "Atendida",
    past:     "Pasada",
  };

  const v = (value ?? "").toString().trim().toLowerCase();
  const cls = colorByStatus[v] ?? "bg-gray text-gray-dark";   
  const label = labelByStatus[v] ?? "—";                      

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}
      aria-label={`Estado: ${label}`}
    >
      {label}
    </span>
  );
}

/* 
===========================================================
Resumen — AppointmentStatusBadge (chip de estado)
===========================================================
1) Responsabilidad
   - Componente de presentación puro: recibe un estado interno en INGLÉS y pinta
     una “chapita” con color corporativo y etiqueta VISIBLE en ESPAÑOL.

2) Prop esperada
   - value: "pending" | "attended" | "past"
     (puede venir en mayúsculas/mixto; se normaliza a minúsculas y trim).

3) Mapeos y fallbacks
   - colorByStatus: asigna clases Tailwind a cada estado según la paleta @theme:
       pending  → bg-orange text-white
       attended → bg-green-dark text-gray-dark
       past     → bg-gray text-gray-dark
   - labelByStatus: etiqueta visible para el usuario:
       pending  → "Pendiente"
       attended → "Atendida"
       past     → "Pasada"
   - Fallbacks: si llega un valor desconocido/undefined:
       - color → gris por defecto
       - label → "—" (guion) para no romper la UI

4) Normalización defensiva
   - v = (value ?? "").toString().trim().toLowerCase();
     Evita errores si llega null, undefined o un valor con espacios/mayúsculas.

5) Accesibilidad
   - aria-label con "Estado: {label}" para lectores de pantalla.

6) Extensión futura
   - Si añadís estados nuevos (ej. "canceled"), ampliar colorByStatus y labelByStatus.
   - Si queréis validación, añadir PropTypes.oneOf o migrar a TypeScript con un union type.
   - Si este badge se reutiliza en más features, considerar moverlo a shared/components.

*/

