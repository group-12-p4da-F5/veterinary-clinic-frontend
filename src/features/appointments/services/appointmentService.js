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
