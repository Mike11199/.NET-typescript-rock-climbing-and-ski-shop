import { User } from "types";

export const OrderDetailsHeaderContainer = ({
  userInfo,
  user,
  paymentMethod,
  isDelivered,
  isPaid,
}: {
  userInfo: { name: string; lastName: string };
  user?: User;
  paymentMethod: string;
  isDelivered: boolean | Date | undefined;
  isPaid: boolean | Date | undefined;
}) => (
  <div className="cartDetailsContainer">
    {/* Shipping & Payment Section */}
    <div className="infoContainer">
      {/* Shipping Section */}
      <div className="shippingContainer">
        <div>
        <h4 style={{ fontWeight: "400" }}>Shipping</h4>
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
                {user?.address} {user?.city} {user?.state} {user?.zipCode}
              </td>
            </tr>
            <tr>
              <td>
                <div>Phone</div>
              </td>
              <td>{user?.phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Section */}
      <div className="paymentContainer">
        <div>
        <h4 style={{ fontWeight: "400" }}>Payment Method</h4>
        <hr />
        </div>
        <span style={{ paddingLeft: "1rem" }}>{paymentMethod}</span>
      </div>
    </div>

    {/* Status Messages */}
    <div className="statusContainer">
      <div
        style={{ width: "50%", padding: "1rem" }}
        className={isDelivered ? "success-alert" : "error-alert"}
      >
        {isDelivered ? <>Delivered at {isDelivered}</> : <>Not Delivered</>}
      </div>
      <div
        style={{ width: "50%", padding: "1rem" }}
        className={isPaid ? "success-alert" : "error-alert"}
      >
        {isPaid ? <>Paid on {isPaid}</> : <>Not Paid Yet</>}
      </div>
    </div>
  </div>
);
