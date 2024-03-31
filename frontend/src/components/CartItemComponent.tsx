import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { Product } from "types";

interface CartItemProps {
  product:  Product;
  removeFromCartHandler?: any;
  orderCreated?: boolean | undefined;
  changeCount?: any;
}


const CartItemComponent = ({ product, removeFromCartHandler = false, orderCreated = false, changeCount = false }: CartItemProps) => {

  console.log("item in cartitem component")
  console.log(product)

  const productId = product?.productId
  const productUrl = `/product-details/${productId}`;

  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col md={2}>
            <Image
              crossOrigin="anonymous"
              src={product?.images?.at(0)?.imageUrl ?? "" }
              fluid
            />
          </Col>
          <Col md={2}>
            <a href={productUrl}>{product?.name}</a>
          </Col>
          <Col md={2}>
            <b>${(product?.price ?? 0).toFixed(2)}</b>
          </Col>
          <Col md={3}>
            <Form.Select onChange={changeCount ? (e) => changeCount(product?.productId, e.target.value) : undefined } disabled={orderCreated} value={1}>
              {[...Array(product?.count).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <RemoveFromCartComponent
            orderCreated={orderCreated}
            productId={product?.productId}
            quantity={1}
            price={product?.price}
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

