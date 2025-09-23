import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/Layout"
import MyAppointmentsPage from "../../features/appointments/pages/MyAppointmentsPage";
import AdminCreateAppointmentPage from "../../features/appointments/pages/AdminCreateAppointmentPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "mis-citas",              
        element: <MyAppointmentsPage />
      },
      {
        path: "nueva-cita",
        element: <AdminCreateAppointmentPage />
      },
    ],
  },
])

export default router
