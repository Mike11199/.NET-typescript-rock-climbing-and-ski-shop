import UserCartDetailsPageComponent from "./components/UserCartDetailsPageComponent";

import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  clearCart,
} from "../../redux/actions/cartActions";
import { User, StoredUserInfo, orderDataDTO, Order } from "../../types";
import { ReduxAppState } from "../../types";

import axios from "axios";

const UserCartDetailsPage = () => {
  const cartItems = useSelector((state: ReduxAppState) => state.cart.cartItems);
  const itemsCount = useSelector(
    (state: ReduxAppState) => state.cart.itemsCount,
  );
  const cartSubtotal = useSelector(
    (state: ReduxAppState) => state.cart.cartSubtotal,
  );
  const userInfo: StoredUserInfo = useSelector(
    (state: ReduxAppState) => state.userRegisterLogin.userInfo,
  );

  const reduxDispatch = useDispatch();

  const getUser = async () => {
    const { data } = await axios.get<User>(
      "/apiv2/users/profile/" + userInfo?.userId,
    );
    return data;
  };

  const createOrder = async (orderData: orderDataDTO) => {
    const { data } = await axios.post<Order>("/apiv2/orders", { ...orderData });
    return data;
  };

  return (
    <UserCartDetailsPageComponent
      cartItems={cartItems}
      itemsCount={itemsCount}
      cartSubtotal={cartSubtotal}
      userInfo={userInfo}
      addToCart={addToCart}
      removeFromCart={removeFromCart}
      reduxDispatch={reduxDispatch}
      getUser={getUser}
      createOrder={createOrder}
      clearCart={clearCart}
    />
  );
};

export default UserCartDetailsPage;
