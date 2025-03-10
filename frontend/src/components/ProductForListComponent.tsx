import React from "react";
import { Rating } from "react-simple-star-rating";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Product } from "types";

import { addToCart } from "../redux/actions/cartActions";
import { ReduxAppState, Image } from "types";
import {
  toastAddedToCart,
  toastError,
} from "../../src/utils/ToastNotifications";

const ProductForListComponent = ({ product }: { product: Product }) => {
  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: ReduxAppState) => state.cart.cartItems);
  const cartSubtotal = useSelector(
    (state: ReduxAppState) => state.cart.cartSubtotal
  );

  const addToCartHandler = async () => {
    try {
      await dispatch(addToCart(product?.productId, 1));
      toastAddedToCart("Added to cart!", navigate, cartItems, cartSubtotal);
    } catch (error: any) {
      toastError(error?.toString());
    }
  };

  const mainThumbnailImage = product?.images?.find(
    (x: Image) => x?.isMainImage === true
  );
  const productReviewScore: number = getAverageRating(product?.reviews);

  return (
    <div className="product-card">
      <Link
        to={`/product-details/${product?.productId}`}
        className="product-card-title-link"
      >
        <div className="product-image-container">
          <img
            className="product-card-image"
            crossOrigin="anonymous"
            src={mainThumbnailImage?.imageUrl ?? ""}
            alt={product?.name ?? ""}
          />
        </div>
      </Link>
      <div className="product-description-container">
        <div className="product-card-body">
          <Link
            to={`/product-details/${product?.productId}`}
            className="product-card-title-link"
          >
            <h5>{product?.name ?? ""}</h5>
          </Link>

          <p className="product-card-text">{product?.description ?? ""}</p>

          <div className="product-price">
            Price{" "}
            <span className="bold-text">${product?.price?.toFixed(2)}</span>
          </div>

          <div>
            <Rating
              readonly
              onClick={() => null}
              ratingValue={productReviewScore}
              size={20}
            />
          </div>

          <div className="product-review-count">
            {product?.reviews?.length} Reviews
          </div>
          <div>{productReviewScore.toFixed(2)} Average Rating</div>
        </div>
        
        <div className="product-buttons-container">
        <ProductCountRemainingContainer {...{ product }} />
          <button
            type="button"
            className="product-list-card-add-to-cart-button"
            onClick={addToCartHandler}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForListComponent;

const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return total / reviews.length;
};

export const ProductCountRemainingContainer = ({ product }: { product: Product }) => {
  return (product?.count ?? 0) > 0 ? (
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
  );
};
