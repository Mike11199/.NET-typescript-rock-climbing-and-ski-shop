import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";

import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";

const UserCartDetailsPage = () => {

    const cartItems = useSelector((state) => state.cart.cartItems);
    const itemsCount = useSelector((state) => state.cart.itemsCount);
    const cartSubtotal = useSelector((state) => state.cart.cartSubtotal);

    const reduxDispatch = useDispatch();

  return <UserCartDetailsPageComponent cartItems={cartItems} itemsCount={itemsCount} cartSubtotal={cartSubtotal} addToCart={addToCart} removeFromCart={removeFromCart} reduxDispatch={reduxDispatch} />;
};

export default UserCartDetailsPage;

