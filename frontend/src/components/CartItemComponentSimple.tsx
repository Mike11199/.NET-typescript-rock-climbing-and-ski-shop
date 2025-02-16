import { Row, Col, Image, ListGroup } from "react-bootstrap";
import { Product, Image as ProductImage } from "../types";
import "../index.css"

interface CartItemProps {
  item: Product;
}

const CartItemComponentSimple = ({ item }: CartItemProps) => {
  return (
    <>
      <div
        className="orderGridProductItem"
      >
        <div style={{ width: "100%" }}>
          <Image
            crossOrigin="anonymous"
            src={
              item?.images?.find((x: ProductImage) => x?.isMainImage === true)
                ?.imageUrl ?? ""
            }
            fluid
          />
        </div>
        <Col>{item?.name}</Col>
        <Col>
          <b>${item?.price?.toFixed(2)}</b>
        </Col>
      </div>
    </>
  );
};

export default CartItemComponentSimple;
