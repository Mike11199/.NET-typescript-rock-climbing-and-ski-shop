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

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Confetti from "react-dom-confetti";
import toast, { Toaster } from "react-hot-toast";
import ShoppingCartImage from "../../../images/shopping_cart.png";
import { ConfettiConfig } from "react-dom-confetti";
import { CartProduct, StoredUserInfo, User, orderDataDTO, Order, UserAddress, Product} from "types";


interface UserCartDetailsPageComponentProps {
  cartItems: CartProduct[];
  itemsCount: number;
  cartSubtotal: number;
  userInfo: StoredUserInfo;
  addToCart: any;
  removeFromCart: any;
  reduxDispatch: any;
  getUser: () => Promise<User>;
  createOrder: (orderData: orderDataDTO) => Promise<Order>;
}

const UserCartDetailsPageComponent = ({
  cartItems,
  itemsCount,
  cartSubtotal,
  userInfo,
  addToCart,
  removeFromCart,
  reduxDispatch,
  getUser,
  createOrder,
}: UserCartDetailsPageComponentProps) => {

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<UserAddress | undefined>(undefined);
  const [missingAddress, setMissingAddress] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("PayPal");
  const [confetti, setConfetti] = useState<boolean>(false);

  const config: ConfettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 160,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const navigate = useNavigate();

  const changeCount = (productId: string, count: number) => {
    try {
      reduxDispatch(addToCart(productId, count));
    } catch (error) {
      console.error(error);
      toast.error("Error changing cart quantity", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const removeFromCartHandler = (productID, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      try {
        reduxDispatch(removeFromCart(productID, quantity, price));

        toast.success("Removed item from cart!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      } catch (error) {
        console.error(error);
        toast.error("Error removing item from cart.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        const addressInfoIsMissing = (
          !data?.address ||
          !data?.city ||
          !data?.country ||
          !data?.zipCode ||
          !data?.state ||
          !data?.phoneNumber
        )

        if (addressInfoIsMissing) {
          setButtonDisabled(true);
          setMissingAddress(true);
        } else {
          setUserAddress({
            address: data?.address,
            city: data?.city,
            country: data?.country,
            zipCode: data?.zipCode,
            state: data?.state,
            phoneNumber: data?.phoneNumber,
          } as UserAddress);
          setMissingAddress(false);
        }
      })
      .catch((er) =>
        console.log(
          er?.response?.data?.message ? er?.response?.data?.message : er?.response?.data
        )
      );
  }, [userInfo?._id]);

  const orderHandler = () => {
    const orderData: orderDataDTO = {
      paymentMethod: paymentMethod,
      orderItems: cartItems?.map( p => ({
        productId: p?.productId,
        quantity: p?.quantity
      })),
    };
    createOrder(orderData)
      .then((data) => {
        if (data) {
          setConfetti(true);
          setTimeout(() => {
            navigate("/user/order-details/" + data?.orderId);
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <>
      <Toaster />
      <Container fluid>
        <Row className="mt-4">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h1 style={{ marginRight: "20px", marginLeft: "10px" }}>
              Cart Details
            </h1>
            <img
              style={{ marginTop: "0px" }}
              height="60px"
              className="shopping_cart_image"
              alt="shopping_cart_image"
              src={ShoppingCartImage}
            ></img>
          </div>
          <Col md={8}>
            <br />
            <Row>
              <Col md={6}>
                <h2>Shipping</h2>
                <b>Name</b>: {userInfo?.name} {userInfo?.lastName} <br />
                <b>Address</b>: {userAddress?.address} {userAddress?.city}{" "}
                {userAddress?.state} {userAddress?.zipCode} <br />
                <b>Phone</b>: {userAddress?.phoneNumber}
              </Col>
              <Col md={6}>
                <h2>Payment method</h2>
                <Form.Select onChange={choosePayment}>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">
                    Cash On Delivery
                  </option>
                </Form.Select>
              </Col>
              <Row>
                <Col>
                  <Alert className="mt-3" variant="danger">
                    Not Delivered
                  </Alert>
                </Col>
                <Col>
                  <Alert className="mt-3" variant="success">
                    Not paid yet
                  </Alert>
                </Col>
              </Row>
            </Row>
            <br />
            <h2>Order items</h2>
            <ListGroup variant="flush">
              {cartItems.map((item, idx) => (
                <CartItemComponent
                  product={item}
                  key={idx}
                  removeFromCartHandler={removeFromCartHandler}
                  changeCount={changeCount}
                />
              ))}
            </ListGroup>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h3>Order summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Items price (after tax):{" "}
                <span className="fw-bold">${(cartSubtotal ?? 0).toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Shipping: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item>
                Tax: <span className="fw-bold">included</span>
              </ListGroup.Item>
              <ListGroup.Item className="text-danger">
                Total price:{" "}
                <span className="fw-bold">${(cartSubtotal ?? 0).toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid gap-2">
                  <Confetti active={confetti} config={config} />
                  <Button
                    size="lg"
                    onClick={orderHandler}
                    variant="danger"
                    type="button"
                    disabled={buttonDisabled}
                  >
                    Place order
                  </Button>
                  <p style={{ color: "red", fontWeight: "500" }}>
                    {missingAddress && "In order to make an order, fill out your profile with correct address, city etc."}
                  </p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserCartDetailsPageComponent;
