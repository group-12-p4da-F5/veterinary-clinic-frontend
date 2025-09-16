import { createBrowserRouter } from "react-router-dom"
import Layout from "../../shared/layout/Layout"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  }
])

export default router
