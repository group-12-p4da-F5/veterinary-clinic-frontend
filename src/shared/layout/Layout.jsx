import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return(
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      {/* Footer */}
    </div>
  )
}

export default Layout;