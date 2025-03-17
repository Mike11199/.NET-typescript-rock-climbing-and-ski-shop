import RemoveFromCartComponent from "./RemoveFromCartComponent";
import { CartProduct, Image as ProductImage } from "types";
import { Link } from "react-router-dom";

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
        <Link to={productUrl} className="details-link">
          {product?.name}
        </Link>
      </div>

      {/* Product Price */}
      <div className="cart-item-price">
        <div>${(product?.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      {/* Quantity Selector + Remove Button */}
      <div className="cart-selector-and-delete-button-container">
        <div>
          {orderCreated ? (
            // If the order is created, just show the quantity as text
            <span>{product?.quantity}</span>
          ) : (
            // Else, show the <select>
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
              value={product?.quantity}
            >
              {[...Array(product?.count ?? 1).keys()].map((x) => (
                <option key={x + 1} value={x + 1}>
                  {x + 1}
                </option>
              ))}
            </select>
          )}
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
