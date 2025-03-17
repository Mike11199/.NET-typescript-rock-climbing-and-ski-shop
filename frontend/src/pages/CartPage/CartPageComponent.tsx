import { Container, Row, Col, ListGroup } from "react-bootstrap";

import CartItemComponent from "../../components/CartItemComponent";
import ShoppingCartImage from "../../images/shopping_cart.png";
import { useNavigate } from "react-router-dom";
import { StoredUserInfo, ReduxAppState } from "types";
import { useSelector } from "react-redux";
import { toastConfirm, toastSuccess } from "../../utils/ToastNotifications";
import CartSummaryContainer from "./CartSummaryContainer";

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
            <CartSummaryContainer
              cartItems={cartItems}
              cartSubtotal={cartSubtotal}
              goToUserCartDetailsHandler={goToUserCartDetailsHandler}
            />
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
      <h2 style={{ fontWeight: "400" }}>Shopping Cart</h2>
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
