import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home  from "./Pages/Home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {/* <Route index element={<Layout />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
