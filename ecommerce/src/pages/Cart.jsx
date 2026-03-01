import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const {
        cart,
        increaseQty,
        decreaseQty,
        totalPrice,
        clearCart,
    } = useCart();


    const navigate = useNavigate();
    return (
        <div className="cart-container">
            <h2>Your Cart</h2>

            {cart.length === 0 && <p>Your cart is empty</p>}

            {cart.map((item) => (
                <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />

                    <div className="cart-details">
                        <h3>{item.title}</h3>
                        <p>₹{item.price}</p>

                        <div className="quantity">
                            <button onClick={() => decreaseQty(item.id)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)}>+</button>
                        </div>
                    </div>
                </div>
            ))}

            {cart.length > 0 && (
                <div className="cart-summary">
                    <h3>Total: ₹{totalPrice}</h3>

                    <button
                        className="checkout-btn"
                        onClick={() => navigate("/checkout")}
                    >
                        Checkout
                    </button>

                    <button className="clear-btn" onClick={clearCart}>
                        Clear Cart
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
