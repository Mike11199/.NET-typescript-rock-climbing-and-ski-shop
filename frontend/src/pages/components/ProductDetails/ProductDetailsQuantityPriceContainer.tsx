import { Form, Button } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { Product } from "types";

interface ProductDetailsQuantityPriceContainerProps {
  product?: Product;
  quantity: number;
  setQuantity: (value: number) => void;
  addToCartHandler: () => Promise<void>;
  productReviewScore: number;
}

const ProductDetailsQuantityPriceContainer = ({
  product,
  quantity,
  setQuantity,
  addToCartHandler,
  productReviewScore,
}: ProductDetailsQuantityPriceContainerProps) => {
  return (
    <div className="productDetailsSummaryWrapper">
      <h1 className="productDetailsHeaderName">{product?.name}</h1>
      <div className="productDetailsSummaryBodyWrapper">
        <ProductDetailsPriceAndStockInfoContainer {...{ product }} />

        <ProductDetailsStatusContainer {...{ product, productReviewScore }} />

        <ProductDetailsQuantityContainer
          {...{ quantity, product, addToCartHandler, setQuantity }}
        />
      </div>
      <div>{product?.description}</div>
    </div>
  );
};

export default ProductDetailsQuantityPriceContainer;

const ProductDetailsQuantityContainer = ({
  quantity,
  product,
  addToCartHandler,
  setQuantity,
}) => {
  return (
    <div className="productDetailsQuantitySelectContainer">
      <div>
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
      </div>
      <Button type="button" onClick={addToCartHandler} variant="danger">
        Add to cart
      </Button>
    </div>
  );
};

const ProductDetailsStatusContainer = ({ product, productReviewScore }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "end",
        }}
      >
        <Rating
          onClick={() => null}
          readonly
          size={20}
          ratingValue={productReviewScore}
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div>{productReviewScore.toFixed(2)} Average Rating</div>
        <div>|</div>
        <div>
          {product?.reviews?.length ?? 0}{" "}
          {product?.reviews?.length === 1 ? "Review" : "Reviews"}
        </div>
      </div>
    </div>
  );
};

const ProductDetailsPriceAndStockInfoContainer = ({ product }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <strong>Price</strong>
          </td>
          <td>
            <span>${(product?.price ?? 0).toFixed(2)}</span>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Status</strong>
          </td>
          <td>
            {(product?.count ?? 0) > 0 ? (
              (product?.count ?? 0) < 10 ? (
                <span style={{ color: "red" }}>
                  Low stock - {product?.count} remaining
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  Many available - {product?.count} remaining
                </span>
              )
            ) : (
              <span style={{ color: "red" }}>Out of stock!</span>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
