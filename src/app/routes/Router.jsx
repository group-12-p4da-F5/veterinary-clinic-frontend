
import { createBrowserRouter } from "react-router-dom";
import Layout from "../../shared/layout/Layout";
import HomePage from "../pages/HomePage"; // La importación va aquí

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
        ],
    },
]);
export default router;