import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/BasicLayout"
import CredentialsLayout from "../../shared/layout/CredentialsLayout"
import Login from "../../features/auth/pages/login"
import Register from "../../features/auth/pages/Register"
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
    ]
  },
  {
    path: "/login",
    element: <CredentialsLayout />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  },
  {
    path: "/register",
    element: <CredentialsLayout />,
    children: [
      {
        index: true,
        element: <Register />
      }
    ]
  }
])

export default router
