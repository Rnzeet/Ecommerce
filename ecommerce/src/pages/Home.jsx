

import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Slideshow />
      </div>

      <div >
        <ProductList />
         
      </div>
       <Footer />
    </>
  );
}

export default Home;
