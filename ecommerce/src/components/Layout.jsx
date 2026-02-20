import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />
      <div style={{ marginTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
