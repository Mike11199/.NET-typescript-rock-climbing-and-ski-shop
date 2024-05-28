import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";

import CartItemComponent from "../../components/CartItemComponent";
import ShoppingCartImage from "../../images/shopping_cart.png";
import { useNavigate } from "react-router-dom";
import { StoredUserInfo, ReduxAppState } from "types";
import { useSelector } from "react-redux";
import { toastSuccess } from "../../../src/utils/ToastNotifications";

const CartPageComponent = ({
  addToCart,
  removeFromCart,
  cartItems,
  cartSubtotal,
  reduxDispatch,
}) => {
  const changeCount = (productId, count) => {
    reduxDispatch(addToCart(productId, count));
  };

  const userState: StoredUserInfo = useSelector(
    (state: ReduxAppState) => state?.userRegisterLogin?.userInfo
  );

  const removeFromCartHandler = (productID, quantity, price) => {
    if (window.confirm("Are you sure?")) {
      reduxDispatch(removeFromCart(productID, quantity, price));
      toastSuccess("Removed item from cart!");
    }
  };

  const navigate = useNavigate();

  // don't allow order if not logged in
  const goToUserCartDetailsHandler = () => {
    if (userState?.userId) {
      navigate("/user/cart-details");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Container fluid className="subtotal_and_checkout_div_in_cart">
        <Row className="mt-4">
          <Col md={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "20px",
              }}
            >
              <h1 style={{ marginRight: "20px", marginLeft: "10px" }}>
                Shopping Cart
              </h1>
              <img
                style={{ marginTop: "0px" }}
                height="60px"
                className="shopping_cart_image"
                alt="shopping_cart_image"
                src={ShoppingCartImage}
              ></img>
            </div>
            {cartItems?.length === 0 ? (
              <>
                <div className="neutral-alert" style={{marginTop: "1rem", padding: "1rem", marginBottom: "1rem"}}>
                    Your cart is empty
                </div>
              </>
            ) : (
              <ListGroup variant="flush">
                {cartItems?.map((item, idx) => (
                  <CartItemComponent
                    product={item}
                    key={idx}
                    changeCount={changeCount}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </ListGroup>
            )}
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h3>
                  Subtotal ({cartItems?.length}{" "}
                  {cartItems?.length === 1 ? "Product" : "Products"})
                </h3>
              </ListGroup.Item>
              <ListGroup.Item>
                Price:{" "}
                <span className="fw-bold">${cartSubtotal.toFixed(2)}</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  disabled={cartSubtotal === 0}
                  type="button"
                  onClick={() => goToUserCartDetailsHandler()}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CartPageComponent;
