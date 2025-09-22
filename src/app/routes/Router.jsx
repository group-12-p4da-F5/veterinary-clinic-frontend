import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/BasicLayout"
import CredentialsLayout from "../../shared/layout/CredentialsLayout"
import Login from "../../features/auth/pages/login"

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
    path: "/Credentials",
    element: <CredentialsLayout />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  }
])

export default router
