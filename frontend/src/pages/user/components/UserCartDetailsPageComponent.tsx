import { Container, Row, Col } from "react-bootstrap";
import CartItemComponent from "../../../components/CartItemComponent";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Confetti from "react-dom-confetti";
import ShoppingCartImage from "../../../images/shopping_cart.png";
import { ConfettiConfig } from "react-dom-confetti";
import {
  CartProduct,
  StoredUserInfo,
  User,
  orderDataDTO,
  Order,
  UserAddress,
} from "types";

import {
  toastSuccess,
  toastError,
  toastConfirm,
} from "../../../../src/utils/ToastNotifications";
import { CartDetailsHeaderContainer } from "./CartDetailsHeaderContainer";

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
  clearCart: any;
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
  clearCart,
}: UserCartDetailsPageComponentProps) => {
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<UserAddress | undefined>(
    undefined
  );
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
      toastError("Error changing cart quantity.");
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) setButtonDisabled(true);
  }, [cartItems]);

  const removeFromCartHandler = (productID, quantity, price) => {
    toastConfirm("Remove item from cart?", async () => {
      try {
        await reduxDispatch(removeFromCart(productID, quantity, price));
        toastSuccess("Removed item from cart!");
        if (cartItems.length <= 0) setButtonDisabled(true);
      } catch (error) {
        console.error(error);
        toastError("Error removing item from cart.");
      }
    });
  };

  useEffect(() => {
    getUser()
      .then((data) => {
        const addressInfoIsMissing =
          !data?.address ||
          !data?.city ||
          !data?.country ||
          !data?.zipCode ||
          !data?.state ||
          !data?.phoneNumber;

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
      .catch((er) => {
        console.error(er?.response?.data?.message ?? er?.response?.data);
        navigate("/login");
      });
  }, [userInfo?.userId]);

  const orderHandler = () => {
    const orderData: orderDataDTO = {
      paymentMethod: paymentMethod,
      orderItems: cartItems?.map((p) => ({
        productId: p?.productId,
        quantity: p?.quantity,
      })),
    };
    createOrder(orderData)
      .then((data) => {
        if (data) {
          setConfetti(true);
          setTimeout(() => {
            navigate("/user/order-details/" + data?.orderId);
            reduxDispatch(clearCart());
          }, 3000);
        }
      })
      .catch((err) => console.log(err));
  };

  const choosePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Container fluid>
        <Row className="mt-4">
          < CartDetailsHeader />
          <Col md={8} className="order-2 order-md-2">
            <CartDetailsHeaderContainer
              {...{ userInfo, userAddress, choosePayment }}
            />
            {cartItems.length > 0 ? (
              <>
                <h2 className="order-header" style={{ fontWeight: "400", marginTop: "2rem" }}>
                  Order Items
                </h2>
                <div className="product-items-container">
                  {cartItems?.map((item, idx) => (
                    <CartItemComponent
                      product={item}
                      key={idx}
                      removeFromCartHandler={removeFromCartHandler}
                      changeCount={changeCount}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: "1rem", textAlign: "center" }}>
                {" "}
                Please add items to your cart to place an order.
              </div>
            )}
          </Col>
          <Col md={4} className="order-1 order-md-2 mb-2">
            <CartDetailsOrderSummaryContainer
              cartSubtotal={cartSubtotal}
              confetti={confetti}
              config={config}
              orderHandler={orderHandler}
              buttonDisabled={buttonDisabled}
              missingAddress={missingAddress}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserCartDetailsPageComponent;

export const CartDetailsOrderSummaryContainer = ({
  cartSubtotal,
  confetti,
  config,
  orderHandler,
  buttonDisabled,
  missingAddress,
}: {
  cartSubtotal: number;
  confetti: boolean;
  config: any;
  orderHandler: () => void;
  buttonDisabled: boolean;
  missingAddress: boolean;
}) => {
  return (
    <div className="orderSummaryDetailsContainer">
      <div style={{ width: "100%" }}>
        <h4 className="orderDetailsHeader">Order Summary</h4>
        <hr />
      </div>

      <table className="order-summary-table">
        <tbody>
          <tr>
            <td>Items price (after tax)</td>
            <td className="price">${(cartSubtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td className="price">Included</td>
          </tr>
          <tr>
            <td>Tax</td>
            <td className="price">Included</td>
          </tr>
          <tr>
            <td colSpan={2} className="total-divider"></td> {/* Divider Row */}
          </tr>
          <tr className="total-row">
            <td>Total price</td>
            <td className="price total-price">
              ${(cartSubtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-container">
        <Confetti active={confetti} config={config} />
        <button
          onClick={orderHandler}
          className="place-order-button"
          type="button"
          disabled={buttonDisabled}
        >
          Place Order
        </button>
        {missingAddress && (
          <p className="missing-address-warning">
            In order to place an order, please complete your profile with the
            correct address, city, etc.
          </p>
        )}
      </div>
    </div>
  );
};



const CartDetailsHeader = () => {
  return (
    <div className="shopping-cart-header">
      <h2 style={{ fontWeight: "400" }}>Cart Details</h2>
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
