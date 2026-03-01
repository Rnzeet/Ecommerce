

import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />

      <div style={{ marginTop: "80px" }}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
}

export default Layout;
