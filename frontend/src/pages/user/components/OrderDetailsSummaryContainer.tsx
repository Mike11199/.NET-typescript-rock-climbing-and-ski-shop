import { useState } from "react";

const OrderDetailsSummaryContainer = ({
  cartSubtotal,
  orderHandler,
  buttonDisabled,
  orderButtonMessage,
  paypalContainer,
}: {
  cartSubtotal: number;
  orderHandler: () => Promise<void>;
  buttonDisabled: boolean;
  orderButtonMessage: string;
  paypalContainer: React.RefObject<HTMLDivElement>;
}) => {
  const [showPayPal, setShowPayPal] = useState(false);

  return (
    <div className="orderSummaryDetailsContainer">
      <div style={{width: "100%"}}>
        <h4 className="orderDetailsHeader">Order Summary</h4>
        <hr />
      </div>

      <table className="order-summary-table">
        <tbody>
          <tr>
            <td>Items price (after tax)</td>
            <td className="price">${cartSubtotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td className="price">Included</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td className="price">Included</td>
          </tr>
          <tr className="total-row">
            <td>Total price</td>
            <td className="price total-price">${cartSubtotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      <div className="button-container">
        <button
          onClick={() => {
            setShowPayPal(true);
            orderHandler();
          }}
          className="place-order-button"
          type="button"
          disabled={buttonDisabled}
          hidden={orderButtonMessage === "hidden"}
        >
          {orderButtonMessage}
        </button>
      </div>

      {showPayPal && (
        <div style={{ position: "relative", zIndex: "1", width: "100%" }}>
          <div ref={paypalContainer} id="paypal-container-element"></div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsSummaryContainer;
