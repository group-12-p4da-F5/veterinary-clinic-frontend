// MOCK: cuota diaria (0–10) para probar la UI
export async function getDailyQuota(dateISO /* YYYY-MM-DD */) {
  const limit = 10;
  const day = Number(dateISO?.split("-")[2] ?? "0");
  const count = day % 11; //días 10 y 21 del mes dan lleno
  await new Promise((r) => setTimeout(r, 300)); // latencia simulada
  return { count, limit };
}

// MOCK: creación de cita (sustituir por fetch real cuando esté el backend)
export async function createAppointment(payload) {
  // Simula petición y devuelve un id
  await new Promise((r) => setTimeout(r, 400));
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());
  return { id, ...payload };
}

// --- MOCK para la vista admin (reemplazar por API real cuando esté) ---
const MOCK_APPOINTMENTS = [
  { id: "a1", date: "2025-09-05", time: "09:00", petName: "Cookie", ownerName: "Ana García", type: "Consulta", reason: "Revisión", status: "pending" },
  { id: "a2", date: "2025-09-05", time: "09:30", petName: "Mila", ownerName: "Luis Pérez", type: "Vacunación", reason: "Refuerzo", status: "attended" },
  { id: "a3", date: "2025-09-06", time: "10:00", petName: "Rocky", ownerName: "Marta Díaz", type: "Urgencia", reason: "Cojera", status: "past" },
];

export async function getAllAppointments() {
  await new Promise((r) => setTimeout(r, 400)); // latencia simulada
  return MOCK_APPOINTMENTS;
}
