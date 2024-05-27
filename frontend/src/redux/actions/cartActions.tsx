import * as actionTypes from "../constants/cartConstants";
import axios from "axios";
import { Product } from "../../types";

// cart uses local storage so items persist even if a user closes their browser tab
export const addToCart =
  (productId, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get<Product>(
      `/apiv2/products/get-one/${productId}`,
    );

    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        productId: data?.productId,
        name: data?.name,
        price: data?.price,
        images: data?.images ?? null,
        count: data?.count,
        quantity,
      },
    });

    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };

export const removeFromCart =
  (productId, quantity, price) => (dispatch, getState) => {
    dispatch({
      type: actionTypes.REMOVE_FROM_CART,
      payload: { productId: productId, quantity: quantity, price: price },
    });
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  };

export const clearCart = () => (dispatch, getState) => {
  dispatch({
    type: actionTypes.CLEAR_CART,
  });
  localStorage.removeItem("cart");
};
