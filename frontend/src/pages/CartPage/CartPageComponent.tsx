import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";

import CartItemComponent from "../../components/CartItemComponent";
import ShoppingCartImage from "../../images/shopping_cart.png";
import { useNavigate } from "react-router-dom";
import { StoredUserInfo, ReduxAppState } from "types";
import { useSelector } from "react-redux";
import {
  toastConfirm,
  toastSuccess,
} from "../../utils/ToastNotifications";

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
    toastConfirm("Remove item from cart?", () => {
      reduxDispatch(removeFromCart(productID, quantity, price));
      toastSuccess("Removed item from cart!");
    });
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
          <ShoppingCartHeader />
        </Row>
        <Row className="mt-4">
          <Col md={8} className="order-2 order-md-1">
            {cartItems?.length === 0 ? (
              <>
                <div
                  className="neutral-alert"
                  style={{
                    padding: "1rem",
                  }}
                >
                  Your cart is empty
                </div>
              </>
            ) : (
              <div className="product-items-container">
                {cartItems?.map((item, idx) => (
                  <CartItemComponent
                    product={item}
                    key={idx}
                    changeCount={changeCount}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            )}
          </Col>
          <Col md={4} className="order-1 order-md-2 mb-3 mb-md-0">
          <ListGroup className="text-center text-md-start">
              <ListGroup.Item>
                <h3>
                  Subtotal (
                  {cartItems
                    ? cartItems.reduce(
                        (totalQuantity, item) => totalQuantity + item.quantity,
                        0
                      )
                    : 0}{" "}
                  {cartItems && cartItems.length === 1 ? "Item" : "Items"})
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

const ShoppingCartHeader = () => {
  return (
    <div className="shopping-cart-header">
      <h1>Shopping Cart</h1>
      <img
        style={{ marginTop: "0px" }}
        height="60px"
        className="shopping_cart_image"
        alt="shopping_cart_image"
        src={ShoppingCartImage}
      />
    </div>
  );
};
