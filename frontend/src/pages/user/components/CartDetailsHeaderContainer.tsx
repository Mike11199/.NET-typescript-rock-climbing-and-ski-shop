import { StoredUserInfo, UserAddress } from "types";

export const CartDetailsHeaderContainer = ({
  userInfo,
  userAddress,
  choosePayment,
}: {
  userInfo: StoredUserInfo;
  userAddress?: UserAddress;
  choosePayment: (e: any) => void;
}) => (
  <div className="cartDetailsContainer">
    {/* Shipping & Payment Section */}
    <div className="infoContainer">
      {/* Shipping Section */}
      <div className="shippingContainer">
        <h2>Shipping</h2>
        <p>
          <b>Name:</b> {userInfo?.name} {userInfo?.lastName}
          <br />
          <b>Address:</b> {userAddress?.address} {userAddress?.city}{" "}
          {userAddress?.state} {userAddress?.zipCode}
          <br />
          <b>Phone:</b> {userAddress?.phoneNumber}
        </p>
      </div>

      {/* Payment Section */}
      <div className="paymentContainer">
        <h2>Payment Method</h2>
        <select onChange={choosePayment}>
          <option value="PayPal">PayPal</option>
          <option value="Cash">Cash On Delivery</option>
        </select>
      </div>
    </div>

    {/* Status Messages */}
    <div className="statusContainer">
      <div style={{width: "50%", padding: "1rem"}} className="error-alert">Not Delivered</div>
      <div style={{width: "50%", padding: "1rem"}}  className="error-alert">Not Paid Yet</div>
    </div>
  </div>
);
