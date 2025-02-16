import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderWithProductItems } from "types";
import OrderItemComponent from "../../../components/OrderItemComponent";

const UserOrdersPageComponent = ({ getOrders }) => {
  const [orders, setOrders] = useState<OrderWithProductItems[]>([]);

  useEffect(() => {
    getOrders()
      .then((orders) => setOrders(orders))
      .catch((er) => console.log(er));
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="orders-container">
      <div style={{ textAlign: "left", display: "flex", padding: "2rem" }}>
        <h1 className="order-title">My Orders</h1>
      </div>
      {orders.length === 0 && <p className="no-orders">No orders yet...</p>}
      <div className="orders-grid">
        {orders.map((order, idx) => (
          <div className="order-card" key={idx}>
            <div className="order-header">
              <div>
                <strong>Order #</strong>
                <span>{order?.orderId?.split("-")[0]}</span>
              </div>
              <div>
                <strong>Date</strong>{" "}
                {order?.createdAt
                  ? new Date(order.createdAt).toDateString()
                  : "N/A"}
              </div>
              <div>
                <strong>Total</strong>{" "}
                {USDollar.format(order?.orderTotal ?? 999999)}
              </div>
              <div>
                <strong>Items</strong> {order?.itemCount}
              </div>
              <div>
                <strong>Payment</strong> {order?.paymentMethod}
              </div>
              <div>
                <strong>Delivered </strong>{" "}
                {order?.isDelivered ? (
                  <span className="status success">Yes</span>
                ) : (
                  <span className="status error">No</span>
                )}
              </div>
              <div>
                <strong>Paid</strong>{" "}
                {order?.isPaid ? (
                  <span className="status success">Yes</span>
                ) : (
                  <span className="status error">No</span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Link
                  to={`/user/order-details/${order?.orderId}`}
                  className="details-link"
                >
                  View Order Details
                </Link>
              </div>
            </div>

            <div className="order-items">
              <h4>Items</h4>
              <div className="order-items-grid">
                {order?.orderProductItems?.map(
                  (item, idx) =>
                    item?.product && (
                      <OrderItemComponent item={item.product} key={idx} />
                    )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPageComponent;
