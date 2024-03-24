import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { useDispatch, useSelector } from "react-redux";

const CartItemComponent = ({ item, removeFromCartHandler = false, orderCreated = false, changeCount = false }) => {


  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col >
            <Image
              crossOrigin="anonymous"
              src={item.image ? item.image.path ?? null : null}
              fluid
            />
          </Col>
          <Col >{item.name}</Col>
          <Col >
            <b>${item.price.toFixed(2)}</b>
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItemComponent;

