

import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Slideshow />
      </div>

      <div style={{ padding: "20px" }}>
        <ProductList />
         
      </div>
       <Footer />
    </>
  );
}

export default Home;
