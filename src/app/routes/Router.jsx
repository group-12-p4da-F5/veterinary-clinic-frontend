import { createBrowserRouter } from "react-router-dom"
import MyAppointmentsPage from "../../features/appointments/pages/MyAppointmentsPage";
import AdminCreateAppointmentPage from "../../features/appointments/pages/AdminCreateAppointmentPage"
import EditAppointmentPage from "../../features/appointments/pages/EditAppointmentPage"
import Layout from "../../shared/layout/Layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "mis-citas",
        element: <MyAppointmentsPage />,
      },
      {
        path: "nueva-cita",
        element: <AdminCreateAppointmentPage />,
      },
      {
        path: "editar-cita",
        element: <EditAppointmentPage />,
      },
    ],
  },
])

export default router