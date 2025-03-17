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
        <div>
          <h4  className="orderDetailsHeader">Shipping</h4>
          <hr />
        </div>
        <table className="shippingTable">
          <tbody>
            <tr>
              <td>
                <div>Name</div>
              </td>
              <td>
                {userInfo?.name} {userInfo?.lastName}
              </td>
            </tr>
            <tr>
              <td>
                <div>Address</div>
              </td>
              <td>
                {userAddress?.address} {userAddress?.city} {userAddress?.state}{" "}
                {userAddress?.zipCode}
              </td>
            </tr>
            <tr>
              <td>
                <div>Phone</div>
              </td>
              <td>{userAddress?.phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Section */}
      <div className="paymentContainer">
        <div>
          <h4  className="orderDetailsHeader">Payment Method</h4>
          <hr />
        </div>
        <div style={{ paddingLeft: "1rem", width: "100%" }}>
          <select onChange={choosePayment} style={{ width: "100%" }}>
            <option value="PayPal">PayPal</option>
            <option value="Cash">Cash On Delivery</option>
          </select>
        </div>
      </div>
    </div>

    {/* Status Messages */}
    <div className="statusContainer">
      <div style={{ width: "50%", padding: "1rem" }} className="error-alert">
        Not Delivered
      </div>
      <div style={{ width: "50%", padding: "1rem" }} className="error-alert">
        Not Paid Yet
      </div>
    </div>
  </div>
);
