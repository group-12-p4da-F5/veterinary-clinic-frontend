import { createBrowserRouter } from "react-router-dom";

// === Layouts ===
import Layout from "../../shared/layout/BasicLayout";
import CredentialsLayout from "../../shared/layout/CredentialsLayout";

// === Utils ===
import { PrivateRoute, PublicRoute } from "../../shared/utils/RouteGuards";

// === Pages (generales) ===
import HomePage from "../../app/pages/HomePage";

// === Auth ===
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";

// === Appointments ===
import AdminCreateAppointmentPage from "../../features/appointments/pages/AdminCreateAppointmentPage";
import EditAppointmentPage from "../../features/appointments/pages/EditAppointmentPage";
import MyAppointmentsPage from "../../features/appointments/pages/MyAppointmentsPage";
import PatientsListPage from "../../features/appointments/pages/PatientsListPage";
import AdminHomePage from "../../features/appointments/pages/AdminHomePage";
import AdminAppointmentsPage from "../../features/appointments/pages/AdminAppointmentsPage";

// === Treatment ===
// usamos SOLO el TreatmentPage dentro de components
import TreatmentPage from "../../features/treatment/components/TreatmentPage";
import AdminTreatmentListPage from "../../features/treatment/components/AdminTreatmentListPage";

// =====================================================
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/admin", element: <AdminHomePage /> },
      { path: "/nueva-cita", element: <AdminCreateAppointmentPage /> },
      { path: "/editar-cita/:id", element: <EditAppointmentPage /> },
      {
        path: "/mis-citas",
        element: <PublicRoute />,
        children: [{ index: true, element: <MyAppointmentsPage /> }],
      },
      { path: "/pacientes", element: <PatientsListPage /> },

      // === RUTAS DE TRATAMIENTOS ===
      {
        path: "/admin/tratamientos",
        element: <AdminTreatmentListPage />,
      },
      {
        path: "/tratamiento/:treatmentId",
        element: <TreatmentPage />,
      },
      // ==============================

      { path: "/admin/citas-agendadas", element: <AdminAppointmentsPage /> },
    ],
  },

  // === Rutas de Credenciales (Login y Register) ===
  {
    path: "/login",
    element: (
      <PublicRoute>
        <CredentialsLayout />
      </PublicRoute>
    ),
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <CredentialsLayout />
      </PublicRoute>
    ),
    children: [{ index: true, element: <Register /> }],
  },
]);

export default router;