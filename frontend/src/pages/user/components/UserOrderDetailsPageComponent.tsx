import {
  Container,
  Row,
  Col,
  Form,
  Alert,
  ListGroup,
  Button,
} from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  CartProduct,
  OrderProductItem,
  OrderWithProductItems,
  User,
} from "types";

const UserOrderDetailsPageComponent = ({
  userInfo,
  getUser,
  getOrder,
  loadPayPalScript,
}) => {
  const [user, setUser] = useState<User>();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isPaid, setIsPaid] = useState<Date | boolean | undefined>(false);
  const [isDelivered, setIsDelivered] = useState<Date | boolean | undefined>(
    false,
  );
  const [cartSubtotal, setCartSubtotal] = useState<number>(0);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [orderButtonMessage, setOrderButtonMessage] =
    useState<string>("Mark as delivered");
  const [orderProductItems, setOrderProductItems] = useState<
    OrderProductItem[]
  >([]);
  const [cartProductItems, setCartProductItems] = useState<CartProduct[]>([]);

  const paypalContainer = useRef<any>();

  const { id } = useParams();

  // grab user info on page load
  useEffect(() => {
    const updateStateWithUserData = async () => {
      try {
        const data: User = await getUser();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    updateStateWithUserData();
  }, []);

  // transform orderProductItems from API (large object from orders table -> joined to order-product --> joined to products) into cartProductItems objects whenever orderProductItems changes
  useEffect(() => {
    const cartProducts: CartProduct[] =
      orderProductItems
        ?.filter(
          (item) =>
            item?.quantity !== undefined &&
            item?.product?.productId !== undefined,
        )
        .map((item) => {
          const { product, quantity } = item;
          return {
            ...product,
            quantity: quantity as number,
            productId: product!.productId,
          };
        }) || [];
    setCartProductItems(cartProducts);
  }, [orderProductItems]);

  // on page load set order details to toggle buttons/payment method/ whether order is paid/delivered
  useEffect(() => {
    const updateStateWithOrderData = async () => {
      try {
        const data: OrderWithProductItems = await getOrder(id);
        console.log(data);

        setPaymentMethod(data?.paymentMethod ?? "");
        setOrderProductItems(data?.orderProductItems);
        setCartSubtotal(data?.orderTotal ?? 0);

        data?.isDelivered
          ? setIsDelivered(data.deliveredAt)
          : setIsDelivered(false);
        data?.isPaid ? setIsPaid(data.paidAt) : setIsPaid(false);

        //  if it's paid update the button saying it's paid and disable the button
        if (data?.isPaid) {
          setOrderButtonMessage("Order complete.");
          setButtonDisabled(true);
        }
        //  if not paid, show different button based on if paypal or cash on delivery (disable option to pay if cash)
        else {
          if (data?.paymentMethod === "PayPal") {
            setOrderButtonMessage("Pay for your order");
          } else if (data?.paymentMethod === "Cash") {
            setButtonDisabled(true);
            setOrderButtonMessage(
              "Please pay for your order on the day of delivery.",
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    updateStateWithOrderData();
  }, []);

  // handler for the pay for order button
  const orderHandler = async () => {
    setButtonDisabled(true);

    //if payment method is PayPal
    if (paymentMethod === "PayPal") {
      setOrderButtonMessage("hidden");

      // if the order is not already paid, send external request to the paypal API
      // https://github.com/paypal/paypal-js#usage
      if (!isPaid) {
        loadPayPalScript(
          cartSubtotal,
          cartProductItems,
          id,
          updateStateAfterOrder,
        );
      }
    } else {
      setOrderButtonMessage("Your order was placed. Thank you");
    }
  };

  const updateStateAfterOrder = (paidAt) => {
    setOrderButtonMessage("Thank you for your payment!");
    setIsPaid(paidAt); // update date of payment in react local state to update the 'not paid yet' to 'paid at date"
    setButtonDisabled(true); //update state to disable the 'pay for your order button' so user can't submit order again
    paypalContainer.current.style = "display: none"; // toggle the paypal container div to hide paypal buttons
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <h1>Order Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {userInfo?.name} {userInfo?.lastName} <br />
              <b>Address</b>: {user?.address} {user?.city} {user?.state}{" "}
              {user?.zipCode} <br />
              <b>Phone</b>: {user?.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select value={paymentMethod} disabled={true}>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash On Delivery</option>
              </Form.Select>
            </Col>
            <Row>
              <Col>
                <Alert
                  className="mt-3"
                  variant={isDelivered ? "success" : "danger"}
                >
                  {isDelivered ? (
                    <>Delivered at {isDelivered}</>
                  ) : (
                    <>Not delivered</>
                  )}
                </Alert>
              </Col>
              <Col>
                <Alert className="mt-3" variant={isPaid ? "success" : "danger"}>
                  {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                </Alert>
              </Col>
            </Row>
          </Row>
          <br />
          <h2>Order items</h2>
          <ListGroup variant="flush">
            {cartProductItems?.map((item, idx) => {
              return (
                item && (
                  <CartItemComponent
                    product={item}
                    key={idx}
                    orderCreated={true}
                  />
                )
              );
            })}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Items price (after tax):{" "}
              <span className="fw-bold">${cartSubtotal?.toFixed(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price:{" "}
              <span className="fw-bold">${cartSubtotal?.toFixed(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  onClick={orderHandler}
                  variant="danger"
                  type="button"
                  disabled={buttonDisabled}
                  hidden={orderButtonMessage === "hidden"}
                >
                  {orderButtonMessage}
                </Button>
              </div>
              {/* To Render Paypal Buttons - rendered by orderHandler() function dynamically in below div  */}
              <div style={{ position: "relative", zIndex: "1" }}>
                <div ref={paypalContainer} id="paypal-container-element"></div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default UserOrderDetailsPageComponent;
