import { useState } from "react";
import DataTable from "../../../shared/components/DataTable";
import usePatients from "../hooks/usePatients";

export default function PatientsListPage() {
    const [q, setQ] = useState("");

    // los datos vienen del hook (que a su vez usa el servicio y la API/mock)
    const { data: rows, loading, error } = usePatients(q);

    // Columnas requeridas por la historia
    const columns = [
        { key: "name", header: "Nombre" },
        { key: "species", header: "Especie" },
        { key: "breed", header: "Raza" },
        { key: "age", header: "Edad", cell: (r) => (typeof r.age === "number" ? `${r.age} años` : "—") },
        { key: "ownerName", header: "Dueño" },
    ];

    return (
        <main className="mx-auto max-w-screen-xl px-4 py-6">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold">Pacientes</h1>
                <p className="mt-1 text-sm text-gray-500">Listado de todos los pacientes registrados.</p>
            </header>

            {/* Buscador local: actualiza 'q', que dispara el hook con debounce */}
            <section aria-label="Buscador" className="mb-4">
                <label htmlFor="patients-search" className="mb-1 block text-sm font-medium">
                    Buscar
                </label>
                <input
                    id="patients-search"
                    data-testid="patients-search"
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nombre, especie, raza o dueño…"
                    className="w-full rounded-lg border border-gray p-2 text-sm focus:outline-none focus:ring"
                />
            </section>

            {error && (
                <p className="mb-3 text-sm text-orange">
                    No se pudieron cargar los pacientes. Inténtalo de nuevo.
                </p>
            )}

            <section aria-label="Lista de pacientes">
                <DataTable
                    columns={columns}
                    rows={rows}
                    loading={loading}
                    emptyMessage={q ? "Sin resultados para tu búsqueda" : "No hay pacientes registrados"}
                    testId="patients-table"
                />
            </section>
        </main>
    );
}
