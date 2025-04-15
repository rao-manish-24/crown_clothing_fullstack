import { useContext } from "react";
import Button from "../button/button.component";
import "./cart-dropdown.styles.scss";
import { CartContext } from "../../context/cart.context";
import CartItem from "../cart-item/cart-item.component";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user.context";

const CardDropdown = () => {
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen } = useContext(CartContext);
  const { currentUser } = useContext(UserContext);

  const toggleISCartOpen = () => {
    setIsCartOpen(!isCartOpen);
    if (!currentUser) {
      alert("Please Sign in to Checkout!");
      navigate("/auth");
    } else {
      navigate("/checkout");
    }
  };
  return (
    <div className="cart-dropdown-container">
      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map((item) => <CartItem key={item.id} cartItem={item} />)
        ) : (
          <span className="empty-message">Your Cart Is Empty!</span>
        )}
      </div>
      <Button onClick={toggleISCartOpen}>Go To Checkout</Button>
    </div>
  );
};

export default CardDropdown;
