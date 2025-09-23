import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/BasicLayout"
import CredentialsLayout from "../../shared/layout/CredentialsLayout"
import Login from "../../features/auth/pages/login"
import Register from "../../features/auth/pages/Register"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />
      }
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
