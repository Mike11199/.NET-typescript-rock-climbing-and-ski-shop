import * as actionTypes from "../constants/cartConstants";
import { CartProduct } from "../../types";

const CART_INITIAL_STATE: {
  cartItems: CartProduct[];
  itemsCount: number;
  cartSubtotal: number;
} = {
  cartItems: [],
  itemsCount: 0,
  cartSubtotal: 0,
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
  switch (action.type) {
    /**
     * ADD TO CART
     *  CartProduct:
     *    count = number of items in stock
     *    quantity = number of items in cart or being added
     */
    case actionTypes.ADD_TO_CART:
      const productBeingAddedToCart: CartProduct = action.payload;

      // check ui is not immediately adding count greater than in stock somehow
      const maxItemsAvailable = productBeingAddedToCart?.count!;
      if (productBeingAddedToCart.quantity > maxItemsAvailable) {
        throw new Error(
          "Not enough items in stock to add this quantity to the cart."
        );
      }

      const productAlreadyExistsInState = state.cartItems.find(
        (x: CartProduct) => x?.productId === productBeingAddedToCart?.productId
      );

      const currentState = { ...state };

      if (productAlreadyExistsInState) {
        // throw error if new quantity will exceed what's in stock for that item
        const newProductQuantityDesired =
          productAlreadyExistsInState.quantity! +
          productBeingAddedToCart.quantity;

        if (newProductQuantityDesired > maxItemsAvailable) {
          throw new Error(
            "Not enough items in stock to add this quantity to the cart."
          );
        }

        // Update the quantity of the existing product
        currentState.cartItems = state.cartItems.map((x: CartProduct) =>
          x?.productId === productAlreadyExistsInState?.productId
            ? { ...x, quantity: x.quantity + productBeingAddedToCart.quantity }
            : x
        );
      } else {
        // Add new product to cart
        currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
      }

      // Increment only for the product being added
      currentState.itemsCount =
        state.itemsCount + productBeingAddedToCart.quantity;

      // Increment subtotal for the product being added
      currentState.cartSubtotal =
        state.cartSubtotal +
        productBeingAddedToCart.quantity * (productBeingAddedToCart.price ?? 0);

      return currentState;

    /**
     * REMOVE FROM CART
     */
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (x: CartProduct) => x?.productId !== action.payload.productId
        ),
        itemsCount: state.itemsCount - action.payload.quantity,
        cartSubtotal:
          state.cartSubtotal - action.payload.price * action.payload.quantity,
      };
    /**
     * CLEAR CART
     */
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        itemsCount: 0,
        cartSubtotal: 0,
      };

    default:
      return state;
  }
};
