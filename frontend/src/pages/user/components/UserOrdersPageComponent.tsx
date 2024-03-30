
import { Container, Row, Col, Form, Alert, ListGroup, Button, Table } from "react-bootstrap"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItemComponent from "../../../components/CartItemComponentSimple";


const UserOrdersPageComponent = ({getOrders}) => {
    const [orders, setOrders] = useState<any>([]);

    const [showDetails, setShowDetails] = useState<any>({});


    const dropDownStyle = {
      slide: {
          overflow: "hidden",
          transitionProperty: "height",
          transitionDuration: "400ms",
          height: 0
      },
      slideOpen: {
          overflow: "visible",
          transitionProperty: "height",
          transitionDuration: "400ms",
      }
  };


    useEffect(() => {
        getOrders()
        .then(orders => setOrders(orders))
        .catch((er) => console.log(er));
    }, [])

    useEffect(() => {
      console.log(orders)
  }, [orders])

    useEffect(() => {
      let defaultShowDetails = {};
      for (let i = 0; i < orders.length; i++) {
        defaultShowDetails[orders[i]._id] = true;
      }
      setShowDetails(defaultShowDetails);
    }, [orders]);


    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const toggleDetails = (orderId) => {
      setShowDetails(prevShowDetails => ({
        ...prevShowDetails,
        [orderId]: !prevShowDetails[orderId]
      }));
    };

    useEffect(() => {
      {console.log(orders)}
    },[orders])

  return (
    <>
    <Row className="m-5">
      <Col md={12}>
        <h1>My Orders</h1>
        <Table striped bordered hover >
          <thead style={{textAlign:'center'}}>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Count</th>
              <th>Delivered</th>
              <th>Paid?</th>
              <th>Payment</th>
              <th style={{ textAlign: 'center' }}>Order Details</th>
              <th style={{ textAlign: 'center', minWidth:'100px' }}>Toggle Details</th>
              <th style={{width:'50%'}}>Order Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(
              (order, idx) => (
                <tr key={idx}>
                  <td>{idx +1}</td>
                  <td>You</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{USDollar.format(order.orderTotal.cartSubtotal)}</td>
                  <td>{order.cartItems.length}</td>
                  <td>
                    {order.isPaid ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                  </td>
                  <td>
                    {order.isPaid ? <i className="bi bi-check-lg text-success"></i> : <i className="bi bi-x-lg text-danger"></i>}
                  </td>
                  <td>
                   {order.paymentMethod === 'pp' ? 'PayPal' : 'Cash'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Link to={`/user/order-details/${order._id}`}>View Order Details</Link>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Button variant="danger" onClick={() => toggleDetails(order._id)}>
                      {showDetails[order._id] ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </td>
                  <>
                  {showDetails.hasOwnProperty(order._id) && showDetails[order._id]  && (
                    <td>
                    <ListGroup variant="flush" >
                      {order.cartItems.map((item, idx) => (
                        <div>
                        <CartItemComponent item={item} key={idx} orderCreated={true}/>
                        </div>
                      ))}
                    </ListGroup>
                  </td>
                  )}
              </>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Col>
    </Row>
    </>
  );
};

export default UserOrdersPageComponent;

