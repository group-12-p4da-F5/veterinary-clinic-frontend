import React from 'react';

/**
 * Componente para mostrar una fila de dato (Etiqueta y Valor)
 * @param {string} label - El nombre del campo (ej: "Nombre")
 * @param {string} value - El valor del campo (ej: "Cookie")
 */
const DataRow = ({ label, value }) => {
  return (
    // 'text-sm' para tamaño pequeño, 'flex' para alinear label y value
    <p className="flex text-sm">
      {/* 'font-semibold' y 'w-28' para dar fuerza y un ancho fijo al label */}
      <span className="font-semibold text-gray-700 w-28">{label}:</span> 
      <span className="text-gray-800 ml-2">{value}</span>
    </p>
  );
};

export default DataRow;