import React from "react";
import { Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { Product, StoredUserInfo } from "types";

interface ProductDetailsUserReviewsProps {
  product?: Product | undefined;
  messagesEndRef: React.MutableRefObject<any>;
  userInfo?: StoredUserInfo | undefined;
  sendReviewHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  productReviewed?: string | undefined | boolean;
  productReviewErrorMessage?: string | undefined;
}

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "short", // Valid values: "narrow", "short", "long"
  year: "numeric", // Valid values: "numeric", "2-digit"
  month: "long", // Valid values: "numeric", "2-digit", "narrow", "short", "long"
  day: "numeric", // Valid values: "numeric", "2-digit"
  hour: "2-digit", // Valid values: "numeric", "2-digit"
  minute: "2-digit", // Valid values: "numeric", "2-digit"
  timeZoneName: "short", // Valid values: "short", "long"
};

const ProductDetailsUserReviews: React.FC<ProductDetailsUserReviewsProps> = ({
  product,
  messagesEndRef,
  userInfo,
  sendReviewHandler,
  productReviewed,
  productReviewErrorMessage,
}) => {
  return (
    <>
      <div className="userReviewsContainer">
        {product?.reviews?.map((review, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <h5>REVIEWS</h5>
            <div>
              {review.user?.name} {review.user?.lastName} -{" "}
              {review?.rating?.toFixed(1)}
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <Rating
                readonly
                size={20}
                ratingValue={review.rating ?? 0}
                onClick={() => null}
              />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              {new Intl.DateTimeFormat(undefined, dateOptions).format(
                new Date(review?.createdAt ?? 0)
              )}
            </div>
            <div>{review.comment}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <hr style={{marginTop: "2rem"}}/>
      {!userInfo?.name && (
        <div
          style={{ padding: "1.5rem", margin: "1.5rem 0rem" }}
          className="error-alert"
        >
          Login first to write a review
        </div>
      )}
      <Form onSubmit={sendReviewHandler}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Write a review</Form.Label>
          <Form.Control
            className="custom-input-group-field"
            name="comment"
            required
            as="textarea"
            disabled={!userInfo?.name}
            rows={3}
          />
        </Form.Group>
        <Form.Select
          name="rating"
          required
          disabled={!userInfo?.name}
          aria-label="Default select example"
        >
          <option value="">Your rating</option>
          <option value="5">5 (very good)</option>
          <option value="4">4 (good)</option>
          <option value="3">3 (average)</option>
          <option value="2">2 (bad)</option>
          <option value="1">1 (awful)</option>
        </Form.Select>
        <Button
          disabled={!userInfo?.name}
          type="submit"
          className="mb-3 mt-3"
          variant="primary"
        >
          Submit
        </Button>
        {productReviewed && (
          <div style={{ color: "green" }}>{productReviewed}</div>
        )}
        {productReviewErrorMessage !== "" && (
          <div style={{ color: "red" }}>{productReviewErrorMessage}</div>
        )}
      </Form>
    </>
  );
};

export default ProductDetailsUserReviews;
