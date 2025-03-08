import { Row, Col, Container } from "react-bootstrap";
import ProductDetailsQuantityPriceContainer from "./ProductDetailsQuantityPriceContainer";

import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, ReduxAppState } from "types";

import {
  toastSuccess,
  toastError,
  toastAddedToCart,
} from "../../utils/ToastNotifications";
import { useSelector } from "react-redux";
import ProductDetailsUserReviews from "./ProductDetailsUserReviews";
import ProductDetailsImagesContainer from "./ProductDetailsImagesContainer";
import { ProductDetailsLoadingSpinner } from "./ProductDetailsLoadingSpinner";

const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  userInfo,
  writeReviewApiRequest,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productReviewed, setProductReviewed] = useState<boolean | string>(
    false
  );
  const [productReviewErrorMessage, setProductReviewErrorMessage] =
    useState<string>("");

  const messagesEndRef = useRef<any>(null);

  const cartItems = useSelector((state: ReduxAppState) => state.cart.cartItems);
  const cartSubtotal = useSelector(
    (state: ReduxAppState) => state.cart.cartSubtotal
  );

  const addToCartHandler = async () => {
    try {
      await reduxDispatch(addToCartReduxAction(id, quantity));
      toastAddedToCart("Added to cart!", navigate, cartItems, cartSubtotal);
    } catch (error: any) {
      toastError(error?.toString());
    }
  };

  useEffect(() => {
    if (productReviewed) {
      setTimeout(() => {
        messagesEndRef?.current.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [productReviewed]);

  useEffect(() => {
    const sortedImages = product?.images?.sort((a, b) => {
      if (a.isMainImage && !b.isMainImage) return -1;
      if (b.isMainImage && !a.isMainImage) return 1;
      return 0;
    });

    sortedImages?.forEach((image) => {
      const imageElement = document.getElementById(`image_id_${image.imageId}`);
      if (imageElement) {
        new ImageZoom(imageElement, {
          scale: 2,
          offset: { vertical: 0, horizontal: 0 },
        });
      }
    });

    // Cleanup function to potentially clean up ImageZoom instances
    return () => {};
  }, [product?.images]);

  useEffect(() => {
    getProductDetails(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((er) =>
        setError(
          (er?.response?.data?.message
            ? er?.response?.data?.message
            : er?.response?.data) ?? "Error"
        )
      );
  }, [id, productReviewed]);

  const sendReviewHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget.elements;
    const formInputs = {
      comment: form.comment.value,
      rating: form.rating.value,
    };
    if (e.currentTarget.checkValidity() === true) {
      try {
        const data = await writeReviewApiRequest(
          product?.productId,
          formInputs
        );
        if (data?.success === "New Review Created.") {
          toastSuccess("Successfully reviewed product.");
          setProductReviewed("Successfully reviewed product.");
          setProductReviewErrorMessage("");
        }
        console.log(data);
      } catch (er: any) {
        console.log(er?.response?.data), setProductReviewed(false);
        toastError(er?.response?.data);
        setProductReviewErrorMessage(
          er?.response?.data?.message ?? er?.response?.data
        );
      }
    }
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  const productReviewScore = getAverageRating(product?.reviews);

  useEffect(() => {
    if (product) console.log(product);
  }, [product]);

  return (
    <>
      {loading ? (
        <ProductDetailsLoadingSpinner />
      ) : error ? (
        <ProductDetailsErrorMessage {...{ error }} />
      ) : (
        <></>
      )}
      <Container>
        <Row className="mt-5">
          {!loading && (
            <>
              <Col style={{ zIndex: 1 }} md={4}>
                <ProductDetailsImagesContainer {...{ product }} />
              </Col>
              <Col md={8}>
                <Row>
                  <ProductDetailsQuantityPriceContainer
                    {...{
                      product,
                      quantity,
                      setQuantity,
                      addToCartHandler,
                      productReviewScore,
                    }}
                  />
                </Row>
                <Row className="mt-4">
                  <ProductDetailsUserReviews
                    {...{
                      product,
                      messagesEndRef,
                      userInfo,
                      sendReviewHandler,
                      productReviewed,
                      productReviewErrorMessage,
                    }}
                  />
                </Row>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
};

export default ProductDetailsPageComponent;

const ProductDetailsErrorMessage = (error: any) => {
  return (
    <div>
      <div>Error loading product details:</div>
      <h2>{error}</h2>
    </div>
  );
};
