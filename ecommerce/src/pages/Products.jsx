import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

function Products() {
  return (
    <div style={{ paddingTop: "100px" }}> {/* padding to avoid header overlap */}
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>All Products</h2>
      <ProductList />
      <Footer />
    </div>
  );
}

export default Products;
