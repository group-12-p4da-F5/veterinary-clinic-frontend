import { Outlet } from "react-router-dom";

const CredentialsLayout = () => {
  return(
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default CredentialsLayout;