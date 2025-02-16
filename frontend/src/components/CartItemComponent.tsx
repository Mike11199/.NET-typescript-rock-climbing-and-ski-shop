import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { CartProduct, Image as ProductImage } from "types";

interface CartItemProps {
  product: CartProduct;
  removeFromCartHandler?: any;
  orderCreated?: boolean | undefined;
  changeCount?: any;
}

const CartItemComponent = ({
  product,
  removeFromCartHandler = false,
  orderCreated = false,
  changeCount = false,
}: CartItemProps) => {
  const productId = product?.productId;
  const productUrl = `/product-details/${productId}`;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <img
          src={
            product?.images?.find((x: ProductImage) => x?.isMainImage === true)
              ?.imageUrl ?? ""
          }
          alt={product?.name ?? ""}
        />
      </div>

      {/* Product Name */}
      <div className="cart-item-name">
        <a href={productUrl}>{product?.name}</a>
      </div>

      {/* Product Price */}
      <div className="cart-item-price">
        <div>${(product?.price ?? 0).toFixed(2)}</div>
      </div>

      {/* Quantity Selector + Remove Button */}
      <div className="cart-selector-and-delete-button-container">
        <div>
          <select
            className="cart-item-select"
            onChange={
              changeCount
                ? (e) => {
                    const newCount = Number(e.target.value);
                    const diff = newCount - (product?.quantity ?? 0);
                    changeCount(product?.productId, diff);
                  }
                : undefined
            }
            disabled={orderCreated}
            value={product?.quantity}
          >
            {[...Array(Math.min(10, product?.count ?? 1)).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>
        </div>
        <div>
          <RemoveFromCartComponent
            orderCreated={orderCreated}
            productId={product?.productId}
            quantity={product?.quantity}
            price={product?.price}
            removeFromCartHandler={removeFromCartHandler || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;
