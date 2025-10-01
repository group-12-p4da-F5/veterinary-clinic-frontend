// src/features/treatment/components/ContentSection.jsx (o donde lo tengas)
import React from 'react';

const ContentSection = ({ title, content, isList = false }) => {
  if (!content) return null; // No renderizar si no hay contenido

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-green-800 mb-2 border-b pb-1">{title}</h3>
      {isList ? (
        <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
          {Array.isArray(content) ? (
            content.map((item, index) => <li key={index}>{item}</li>)
          ) : (
            <li>{content}</li> // Si es lista pero viene como string
          )}
        </ul>
      ) : (
        <p className="text-sm text-gray-700">{content}</p>
      )}
    </div>
  );
};

export default ContentSection;