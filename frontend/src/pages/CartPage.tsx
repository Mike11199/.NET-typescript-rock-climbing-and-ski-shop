import CartPageComponent from "./components/CartPageComponent";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../redux/actions/cartActions";
import { ReduxAppState } from "types";

const CartPage = () => {

    const cartItems = useSelector((state: ReduxAppState) => state.cart.cartItems);
    const cartSubtotal = useSelector((state: ReduxAppState) => state.cart.cartSubtotal);
    const reduxDispatch = useDispatch();

  return <CartPageComponent addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} cartSubtotal={cartSubtotal} reduxDispatch={reduxDispatch} />;
};

export default CartPage;

