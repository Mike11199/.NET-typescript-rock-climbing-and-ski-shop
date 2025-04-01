import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { OrderWithProductItems } from "types";
import OrderItemComponent from "../../../components/OrderItemComponent";
import { Spinner } from "react-bootstrap";

const UserOrdersPageComponent = ({ getOrders }) => {
  const [orders, setOrders] = useState<OrderWithProductItems[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching orders...");
    getOrders()
      .then((orders) => {
        setOrders(orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
        setLoading(false);
      });
  }, []);

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className="orders-container">
      <div style={{ textAlign: "left", display: "flex", padding: "2rem" }}>
        <h2 className="order-title">My Orders</h2>
      </div>

      {/* Show Spinner when loading */}
      {loading && <UserOrdersLoadingSpinner />}

      {/* Show Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Show "No orders" message if there are no orders */}
      {!loading && !error && orders.length === 0 && (
        <p className="no-orders">No orders yet...</p>
      )}

      {/* Show orders only when not loading and no error */}
      {!loading && !error && (
        <div className="orders-grid">
          {orders.map((order, idx) => (
            <div className="order-card" key={idx}>
              <div className="order-header">
                <LabelValuePair
                  label="Order #"
                  value={order?.orderId?.split("-")[0]}
                />
                <LabelValuePair
                  label="Date"
                  value={
                    order?.createdAt
                      ? new Date(order.createdAt).toDateString()
                      : "N/A"
                  }
                />
                <LabelValuePair
                  label="Total"
                  value={USDollar.format(order?.orderTotal ?? 0)}
                />
                <LabelValuePair label="Items" value={order?.itemCount} />
                <LabelValuePair label="Payment" value={order?.paymentMethod} />
                <LabelValuePair
                  label="Delivered"
                  value={
                    order?.isDelivered ? (
                      <span className="status success">Yes</span>
                    ) : (
                      <span className="status error">No</span>
                    )
                  }
                />
                <LabelValuePair
                  label="Paid"
                  value={
                    order?.isPaid ? (
                      <span className="status success">Yes</span>
                    ) : (
                      <span className="status error">No</span>
                    )
                  }
                />
                <LabelValuePair
                  label="Details"
                  value={
                    <Link
                      to={`/user/order-details/${order?.orderId}`}
                      className="details-link"
                    >
                      View Order Details
                    </Link>
                  }
                />
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
      )}
    </div>
  );
};

const UserOrdersLoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
    }}
  >
    <span>Fetching orders...</span>
    <Spinner
      animation="border"
      variant="primary"
      role="status"
      aria-label="Loading orders"
    />
  </div>
);

export default UserOrdersPageComponent;

interface LabelValuePairProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

const LabelValuePair: React.FC<LabelValuePairProps> = ({
  label,
  value,
}) => {
  return (
    <div className={`order-label-pair`}>
      <div className="order-label-pair-label">{label}</div>
      <div className="order-label-pair-value">{value}</div>
    </div>
  );
};
