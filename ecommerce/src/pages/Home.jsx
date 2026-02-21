
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import Slideshow from "../components/SlideShow";
import ProductCard from "../components/Products";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";



function Home() {
  return (
    <>
      <Layout/>
      {/* <Outlet /> */}
  
      <div style={{ marginTop: "80px",width:"100%" }}>
<ProductList/>
      </div>
      <div>
        <Footer/>
      </div>
    </>
  );
}

export default Home;
