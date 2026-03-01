// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import Home  from "./pages/Home";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />}>
//           {/* <Route index element={<Layout />} /> */}
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
// import { Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout";
// import Home from "./pages/Home";

// function App() {
//   return (
//     <Layout>
//       <Routes>
//         <Route path="/" element={<Home />} />
//       </Routes>
//     </Layout>
//   );
// }

// export default App;



import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        
<Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}

export default App;

