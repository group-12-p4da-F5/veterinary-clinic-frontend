import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/Layout"
import MyAppointmentsPage from "../../features/appointments/pages/MyAppointmentsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "mis-citas",              
        element: <MyAppointmentsPage />
      },
    ],
  },
])

export default router
