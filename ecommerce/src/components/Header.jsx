// import { FaShoppingCart } from "react-icons/fa";
// import "./Header.css";

// function Header() {
//   return (
//     <header className="header">
//       <div className="logo">MyStore</div>

//       <nav>
//         <ul className="nav-links">
//           <li>Home</li>
//           <li>Products</li>
//           <li>About</li>
//         </ul>
//       </nav>

//       <div className="right-section">
//         <input type="text" placeholder="Search..." className="search" />
//         <div className="cart">
//           <FaShoppingCart />
//           <span className="cart-count">0</span>
//         </div>
//         <button className="login-btn">Login</button>
//       </div>
//     </header>
//   );
// }

// export default Header;

import { useState } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">MyStore</div>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <ul className="nav-links">
          <li>Home</li>
          <li>Products</li>
          <li>About</li>
        </ul>
      </nav>

      <div className="right-section">
        <div className="cart">
          <FaShoppingCart />
          <span className="cart-count">0</span>
        </div>
        <button className="login-btn">Login</button>

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
}

export default Header;
