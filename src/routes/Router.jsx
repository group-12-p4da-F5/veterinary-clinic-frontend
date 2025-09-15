import { createBrowserRouter } from "react-router-dom"
import Try from "../pages/Try"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Try />,
  }
])

export default router
