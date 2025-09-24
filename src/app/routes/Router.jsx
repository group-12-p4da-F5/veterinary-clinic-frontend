import { createBrowserRouter } from "react-router-dom"
import AdminCreateAppointmentPage from "../../features/appointments/pages/AdminCreateAppointmentPage"
import EditAppointmentPage from "../../features/appointments/pages/EditAppointmentPage"
import Layout from "../../shared/layout/Layout"
import Layout from "../../shared/layout/BasicLayout"
import CredentialsLayout from "../../shared/layout/CredentialsLayout"
import Login from "../../features/auth/pages/login"
import Register from "../../features/auth/pages/Register"
import MyAppointmentsPage from "../../features/appointments/pages/MyAppointmentsPage";
import HomePage from "../pages/HomePage";
import { PrivateRoute, PublicRoute } from "../../shared/utils/RouteGuards"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
 
      {
        path: "/nueva-cita",
        element: <AdminCreateAppointmentPage />,
      },
      {
        path: "/editar-cita",
        element: <EditAppointmentPage />,
      },
 
        path: "/mis-citas",
        element: <PublicRoute />,
        children: [
          { index: true, element: <MyAppointmentsPage /> }
        ]
      }
    ]
  },
  {
    path: "/login",
    element: (
      <PublicRoute >
        <CredentialsLayout />
      </PublicRoute >
    ),
    children: [
      { index: true, element: <Login /> }
    ]
  },
  {
    path: "/register",
    element: (
      <PublicRoute >
        <CredentialsLayout />
      </PublicRoute >
    ),
    children: [
      { index: true, element: <Register /> }
    ]
  }
])

export default router