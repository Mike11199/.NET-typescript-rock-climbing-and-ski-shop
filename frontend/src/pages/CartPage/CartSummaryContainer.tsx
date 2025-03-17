import { useState } from "react";

const CartSummaryContainer = ({
  cartItems,
  cartSubtotal,
  goToUserCartDetailsHandler,
}: {
  cartItems: { quantity: number }[];
  cartSubtotal: number;
  goToUserCartDetailsHandler: () => void;
}) => {
  const [showPayPal, setShowPayPal] = useState(false);
  const totalQuantity = cartItems
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  return (
    <div className="orderSummaryDetailsContainer">
    <div style={{width: "100%"}}>
      <h3 className="order-title">
        Subtotal ({totalQuantity} {cartItems.length === 1 ? "Item" : "Items"})
      </h3>
      <hr />
      </div>
      <p>
        Price: <span className="fw-bold">${cartSubtotal.toFixed(2)}</span>
      </p>
      <button
        disabled={cartSubtotal === 0}
        type="button"
        className="add-to-cart-button"
        onClick={() => {
          setShowPayPal(true);
          goToUserCartDetailsHandler();
        }}
      >
        Proceed To Checkout
      </button>

      {showPayPal && (
        <div style={{ position: "relative", zIndex: "1" }}>
          <div id="paypal-container-element"></div>
        </div>
      )}
    </div>
  );
};

export default CartSummaryContainer;
