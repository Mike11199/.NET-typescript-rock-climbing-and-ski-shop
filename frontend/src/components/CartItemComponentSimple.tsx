import { Row, Col, Image, ListGroup } from "react-bootstrap";
import { Product } from "../types";

interface CartItemProps {
  item: Product;
}

const CartItemComponent = ({ item }: CartItemProps) => {
  return (
    <>
      <ListGroup.Item>
        <Row>
          <Col>
            <Image
              crossOrigin="anonymous"
              src={item?.images?.at(0)?.imageUrl ?? ""}
              fluid
            />
          </Col>
          <Col>{item?.name}</Col>
          <Col>
            <b>${item?.price?.toFixed(2)}</b>
          </Col>
        </Row>
      </ListGroup.Item>
      <br />
    </>
  );
};

export default CartItemComponent;
