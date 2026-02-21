import Header from "./Header";
import { Outlet } from "react-router-dom";
import Slideshow from "./SlideShow";

function Layout() {
  return (
    <>
      <Header />
      <div  style={{
    padding: "50px",
    marginTop: "100px",
    
    textAlign: "center",
    fontSize: "40px",
    fontWeight: "bold",
    fontFamily: "Poppins, sans-serif",
    color: "#ce1c2b",
    letterSpacing: "2px"
  }}>
        The Best is Here..!!!!
      </div>
      <div style={{ width:'100vw',paddingLeft:"2%",paddingRight:"2"}}>
    <Slideshow/>
    </div>
    </>
  );
}

export default Layout;
