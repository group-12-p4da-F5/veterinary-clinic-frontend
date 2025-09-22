import AppointmentStatusBadge from "./AppointmentStatusBadge";

export default function AppointmentsTable({ rows = [], onRowClick }) {
  const hasRows = rows.length > 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray bg-white shadow-sm">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-gray-dark text-white">
          <tr>
            <th className="py-3 pl-4 text-left">Fecha</th>
            <th className="py-3 text-left">Hora</th>
            <th className="py-3 text-left">Mascota</th>
            <th className="py-3 text-left">Tipo</th>
            <th className="py-3 text-left">Motivo</th>
            <th className="py-3 pr-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {!hasRows ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-dark">
                No hay citas para mostrar.
              </td>
            </tr>
          ) : (
            rows.map((a, idx) => (
              <tr
                key={a.id}
                className={`${
                  idx % 2 === 0 ? "bg-green-light/30" : "bg-white"
                } hover:bg-green-light/60 cursor-default transition-colors`}
                onClick={onRowClick ? () => onRowClick(a) : undefined}
              >
                <td className="py-3 pl-4">{a.date}</td>
                <td className="py-3">{a.time}</td>
                <td className="py-3">{a.petName}</td>
                <td className="py-3">{a.type}</td>
                <td className="py-3">{a.reason}</td>
                <td className="py-3 pr-4">
                  <AppointmentStatusBadge value={a.status} /> 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* 
===========================================================
Resumen — AppointmentsTable (qué hace y cómo se usa)
===========================================================
1) Responsabilidad
   - Componente de presentación (UI) específico del dominio “appointments”.
   - NO hace fetch ni transforma datos: solo pinta lo que recibe por props.

2) Props esperadas
   - rows: Array de objetos con shape:
     { id, date, time, petName, type, reason, status: "pending"|"attended"|"past" }
   - onRowClick?: función opcional que se ejecuta al clicar una fila, recibiendo
     el objeto completo de la cita (útil para navegar a detalle o abrir un modal).
     Ejemplo de uso:
       <AppointmentsTable rows={rows} onRowClick={(row) => navigate(`/appointments/${row.id}`)} />

3) Estructura/estilos (mobile-first con Tailwind)
   - Wrapper con overflow-x-auto → permite scroll horizontal en móviles si la tabla no cabe.
   - min-w-[720px] → evita que las columnas colapsen en pantallas estrechas.
   - Encabezado con bg-gray-dark y texto blanco (según paleta @theme).
   - Cuerpo “zebra” con idx % 2 → alterna fondo para mejorar lectura.
   - Hover con verde suave y transición para feedback visual.

4) Lógica de renderizado
   - hasRows: si no hay filas, se muestra un único <tr> con mensaje “No hay citas...”
     (usa colSpan=6 para abarcar todas las columnas).
   - Si hay filas, se mapean con key=a.id (estabilidad en reconciliación de React).

5) Columna “Estado”
   - Delegada a <AppointmentStatusBadge value={a.status} />.
   - El componente Badge espera los valores internos en INGLÉS ("pending"|"attended"|"past")
     pero pinta la etiqueta visible en ESPAÑOL con los colores de la paleta.

6) Accesibilidad y UX
   - Semántica de tabla completa: thead/tbody/th/td.
   - onRowClick es opcional; si se pasa, cada fila se vuelve “clickable”.
     Si se requiere accesibilidad estricta, preferir un <button> o <Link> dentro de la celda
     en lugar de onRowClick en <tr>.

7) Extensiones futuras
   - Ordenación/paginación se manejan fuera (página o hook) y se pasan ya procesadas en rows.
   - Si esta tabla se reutiliza con más dominios, extraer una DataTable genérica en shared/.
*/

