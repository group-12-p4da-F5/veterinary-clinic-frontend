import React from 'react';

/**
 * Componente para una sección de contenido (Diagnóstico, Tratamiento)
 * @param {string} title - El título de la sección
 * @param {string|string[]} content - El contenido, puede ser un string o un array de strings (para listas)
 * @param {boolean} isList - Si es true, el contenido se renderiza como una lista con viñetas
 */
const ContentSection = ({ title, content, isList = false }) => {
  return (
    // 'border-b pb-4' para el separador visual que se ve en tu diseño
    <div className="mb-6 border-b pb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      
      {isList && Array.isArray(content) ? (
        // Renderiza como lista
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {content.map((item, index) => (
            <li key={index} className="text-sm">{item}</li>
          ))}
        </ul>
      ) : (
        // Renderiza como párrafo. 'whitespace-pre-line' respeta saltos de línea del dato
        <p className="text-sm text-gray-700 whitespace-pre-line">{content}</p>
      )}
    </div>
  );
};

export default ContentSection;