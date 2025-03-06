import { Col, ListGroup, Form, Button } from "react-bootstrap";
import { Product } from "types";

interface ProductDetailsQuantityPriceContainerProps {
  product?: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  addToCartHandler: () => Promise<void>;
}

const ProductDetailsQuantityPriceContainer = ({
  product,
  quantity,
  setQuantity,
  addToCartHandler,
}: ProductDetailsQuantityPriceContainerProps) => {
  return (
    <Col md={4}>
      <ListGroup>
        <ListGroup.Item>
          {/* show product count remaining - or red text low stock if less than 10 */}
          <span>Status: &nbsp;</span>
          {(product?.count ?? 0) > 0 ? (
            (product?.count ?? 0) < 10 ? (
              <span style={{ color: "red", fontWeight: "500" }}>
                Low stock - {product?.count} remaining
              </span>
            ) : (
              <span style={{ color: "green", fontWeight: "500" }}>
                Many available - {product?.count} remaining
              </span>
            )
          ) : (
            <span style={{ color: "red" }}>Out of stock!</span>
          )}
        </ListGroup.Item>
        <ListGroup.Item>
          Price:{" "}
          <span className="fw-bold">${(product?.price ?? 0).toFixed(2)}</span>
        </ListGroup.Item>
        <ListGroup.Item>
          Quantity:
          <Form.Select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            size="lg"
            aria-label="Default select example"
          >
            {[...Array(product?.count ?? 1).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </Form.Select>
        </ListGroup.Item>
        <ListGroup.Item>
          <Button type="button" onClick={addToCartHandler} variant="danger">
            Add to cart
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Col>
  );
};

export default ProductDetailsQuantityPriceContainer;
