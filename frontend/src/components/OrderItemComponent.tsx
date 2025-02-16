import { Image } from "react-bootstrap";
import { Product, Image as ProductImage } from "../types";
import "../index.css"

interface CartItemProps {
  item: Product;
}



const OrderItemComponent = ({ item }: CartItemProps) => {

  const productId = item?.productId;
  const productUrl = `/product-details/${productId}`;

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
       <a href={productUrl}>{item?.name}</a>
      </div>
    </>
  );
};

export default OrderItemComponent;
