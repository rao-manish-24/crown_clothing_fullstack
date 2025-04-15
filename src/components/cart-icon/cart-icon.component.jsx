import "./cart-icon.styles.scss";
import ShoppingIcon from "../../assets/shopping-bag.svg";
import { CartContext } from "../../context/cart.context";
import { useContext } from "react";

const CartIcon = () => {
  const { setIsCartOpen, isCartOpen, cartCount } = useContext(CartContext);
  const toggleISCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };
  return (
    <div className="cart-icon-container" onClick={toggleISCartOpen}>
      <img
        className="shopping-icon"
        src={ShoppingIcon}
        alt="a shoppping icon svg"
      />
      <span className="item-count">{cartCount}</span>
    </div>
  );
};

export default CartIcon;
