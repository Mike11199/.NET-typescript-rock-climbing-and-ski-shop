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
      <h4 className="order-title">
        Subtotal ({totalQuantity} {cartItems.length === 1 ? "Item" : "Items"})
      </h4>
      <hr />
      </div>

      <table className="order-summary-table">
        <tbody>
          <tr>
            <td>Price</td>
            <td className="price">${(cartSubtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td colSpan={2} className="total-divider"></td> {/* Divider Row */}
          </tr>

        </tbody>
      </table>

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
