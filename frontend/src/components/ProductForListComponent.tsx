import React from "react";
import { Rating } from "react-simple-star-rating";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { addToCart } from "../redux/actions/cartActions";
import { ReduxAppState, Image } from "types";
import {
  toastAddedToCart,
  toastError,
} from "../../src/utils/ToastNotifications";

const ProductForListComponent = ({
  productId,
  name,
  description,
  price,
  images,
  rating,
  reviewsNumber,
}) => {
  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: ReduxAppState) => state.cart.cartItems);
  const cartSubtotal = useSelector(
    (state: ReduxAppState) => state.cart.cartSubtotal
  );

  const addToCartHandler = async () => {
    try {
      await dispatch(addToCart(productId, 1));
      toastAddedToCart("Added to cart!", navigate, cartItems, cartSubtotal);
    } catch (error: any) {
      toastError(error?.toString());
    }
  };

  const mainThumbnailImage = images.find((x: Image) => x?.isMainImage === true);

  return (
    <div className="product-card">
      <Link
        to={`/product-details/${productId}`}
        className="product-card-title-link"
      >
        <div className="product-image-container">
          <img
            className="product-card-image"
            crossOrigin="anonymous"
            src={mainThumbnailImage?.imageUrl}
            alt={name}
          />
        </div>
      </Link>
      <div className="product-description-container">
        <div className="product-card-body">
          <Link
            to={`/product-details/${productId}`}
            className="product-card-title-link"
          >
            <h5>{name}</h5>
          </Link>

          <p className="product-card-text">{description}</p>

          <div className="product-price">
            Price <span className="bold-text">${price.toFixed(2)}</span>
          </div>

          <div>
            <Rating
              readonly
              onClick={() => null}
              ratingValue={rating}
              size={20}
            />
          </div>

          <div className="product-review-count">{reviewsNumber} Reviews</div>
          <div>{rating} Average Rating</div>
        </div>
        <div className="product-buttons-container">
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
