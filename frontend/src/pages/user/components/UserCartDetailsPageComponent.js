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
import Confetti from 'react-dom-confetti';
import toast, { Toaster } from 'react-hot-toast';




const UserCartDetailsPageComponent = ({cartItems, itemsCount, cartSubtotal, userInfo,addToCart, removeFromCart, reduxDispatch , getUser, createOrder}) => {

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [userAddress, setUserAddress] = useState(false);
    const [missingAddress, setMissingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("pp");
    const [confetti, setConfetti] = useState(false);


    const config = {
      angle: 90,
      spread: 360,
      startVelocity: 40,
      elementCount: "160",
      dragFriction: 0.12,
      duration: 3000,
      stagger: 3,
      width: "10px",
      height: "10px",
      perspective: "731px",
      colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
    };


    const navigate = useNavigate();

    const changeCount = (productID, count) => {
        reduxDispatch(addToCart(productID, count));
    }

    const removeFromCartHandler = (productID, quantity, price) => {
        if (window.confirm("Are you sure?")) {
            
          // console.log('work!!!')
          reduxDispatch(removeFromCart(productID, quantity, price));
          
            
          toast.success('Removed item from cart!',
          {
            // icon: '👏',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
        }
    }

    useEffect(() => {
        getUser()
        .then((data) => {
            if (!data.address || !data.city || !data.country || !data.zipCode || !data.state || !data.phoneNumber) {
                setButtonDisabled(true);
                setMissingAddress("In order to make order, fill out your profile with correct address, city etc.");
            } else {
                setUserAddress({address: data.address, city: data.city, country: data.country, zipCode: data.zipCode, state: data.state, phoneNumber: data.phoneNumber})
                setMissingAddress(false);
            }
        })
        .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
    }, [userInfo._id])

    const orderHandler = () => {
        const orderData = {
            orderTotal: {
               itemsCount: itemsCount, 
               cartSubtotal: cartSubtotal,
            },
            cartItems: cartItems.map(item => {
                return {
                    productID: item.productID,
                    name: item.name,
                    price: item.price,
                    image: { path: item.image ? (item.image.path ?? null) : null },
                    quantity: item.quantity,
                    count: item.count,

                }
            }),
            paymentMethod: paymentMethod,
        }
       createOrder(orderData)
       .then(data => {
           if (data) {
               setConfetti(true)
               setTimeout(() => {
                // code to be executed after 5 seconds
                navigate("/user/order-details/" + data._id);
              }, 3000);
               
           }
       })
       .catch((err) => console.log(err));
    }

    const choosePayment = (e) => {
        setPaymentMethod(e.target.value);
    }

  return (
    <>
    <Toaster/>
    <Container fluid>
      <Row className="mt-4">
        <h1>Cart Details</h1>
        <Col md={8}>
          <br />
          <Row>
            <Col md={6}>
              <h2>Shipping</h2>
              <b>Name</b>: {userInfo.name} {userInfo.lastName} <br />
              <b>Address</b>: {userAddress.address} {userAddress.city} {userAddress.state} {userAddress.zipCode} <br />
              <b>Phone</b>: {userAddress.phoneNumber}
            </Col>
            <Col md={6}>
              <h2>Payment method</h2>
              <Form.Select onChange={choosePayment}>
                <option value="pp">PayPal</option>
                <option value="cod">
                  Cash On Delivery (delivery may be delayed)
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
              <CartItemComponent item={item} key={idx} removeFromCartHandler={removeFromCartHandler} changeCount={changeCount} />
            ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3>Order summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Items price (after tax): <span className="fw-bold">${cartSubtotal.toFixed(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Shipping: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item>
              Tax: <span className="fw-bold">included</span>
            </ListGroup.Item>
            <ListGroup.Item className="text-danger">
              Total price: <span className="fw-bold">${cartSubtotal.toFixed(2)}</span>
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-grid gap-2">
               <Confetti active={ confetti } config={ config }/>
                <Button size="lg" onClick={orderHandler} variant="danger" type="button" disabled={buttonDisabled}>
                  Place order
                </Button>
                <p style={{color: 'red', fontWeight:'500'}}>
                  {missingAddress}
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

