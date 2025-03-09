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
        <h2>Shipping</h2>
        <p>
          <b>Name:</b> {userInfo?.name} {userInfo?.lastName}
          <br />
          <b>Address:</b> {user?.address} {user?.city} {user?.state}{" "}
          {user?.zipCode}
          <br />
          <b>Phone:</b> {user?.phoneNumber}
        </p>
      </div>

      {/* Payment Section */}
      <div className="paymentContainer">
        <h2>Payment Method</h2>
        <span>{paymentMethod}</span>
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
