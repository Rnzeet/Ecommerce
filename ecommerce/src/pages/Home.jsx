

import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";

function Home() {
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Slideshow />
      </div>

      <div style={{ padding: "20px" }}>
        <ProductList />
      </div>
    </>
  );
}

export default Home;
