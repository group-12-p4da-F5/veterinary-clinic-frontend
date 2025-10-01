// src/features/treatment/components/DataRow.jsx (o donde lo tengas)
import React from 'react';

const DataRow = ({ label, value }) => (
  <div className="flex items-center">
    <dt className="text-gray-600 font-medium w-32">{label}:</dt>
    <dd className="ml-4 text-gray-900">{value}</dd>
  </div>
);

export default DataRow;