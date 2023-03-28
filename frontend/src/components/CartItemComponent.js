import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { useDispatch, useSelector } from "react-redux";

const CartItemComponent = ({ item, removeFromCartHandler = false, orderCreated = false, changeCount = false }) => {

  const {mode}  = useSelector((state) => state.DarkMode)

  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image
              crossOrigin="anonymous"
              // src={item.image && mode === 'dark' ? `${item.image.path.replace('/upload/', '/upload/e_background_removal/')}` : item.image ? item.image.path ?? null : null}
              src={item.image ? item.image.path ?? null : null}
              fluid
            />
          </Col>
          <Col md={2}>{item.name}</Col>
          <Col md={2}>
            <b>${item.price.toFixed(2)}</b>
          </Col>
          <Col md={3}>
            <Form.Select onChange={changeCount ? (e) => changeCount(item.productID, e.target.value) : undefined } disabled={orderCreated} value={item.quantity}>
              {[...Array(item.count).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <RemoveFromCartComponent
            orderCreated={orderCreated}
            productID={item.productID}
            quantity={item.quantity}
            price={item.price}
            removeFromCartHandler={removeFromCartHandler ? removeFromCartHandler : undefined}
             />
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItemComponent;

