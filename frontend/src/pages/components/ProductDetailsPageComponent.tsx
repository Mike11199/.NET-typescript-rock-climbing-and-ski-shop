import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../../components/AddedToCartMessageComponent";
import { useDispatch, useSelector } from "react-redux";
import ImageZoom from "js-image-zoom";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Product } from "types";
import { Spinner } from "react-bootstrap";

const ProductDetailsPageComponent = ({
  addToCartReduxAction,
  reduxDispatch,
  getProductDetails,
  userInfo,
  writeReviewApiRequest,
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productReviewed, setProductReviewed] = useState<boolean | string>(
    false
  );
  const [productReviewErrorMessage, setProductReviewErrorMessage] =
    useState<string>("");

  const messagesEndRef = useRef<any>(null);

  const addToCartHandler = () => {
    reduxDispatch(addToCartReduxAction(id, quantity));
    setShowCartMessage(true);
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
        const data = await writeReviewApiRequest(product?.productId, formInputs);
        if (data?.success === "New Review Created.") {
          setProductReviewed("Successfully reviewed product.");
          setProductReviewErrorMessage("")
        }
        console.log(data)
      } catch (er: any) {
        console.log(er?.response?.data),
        setProductReviewed(false)
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

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // Valid values: "narrow", "short", "long"
    year: "numeric", // Valid values: "numeric", "2-digit"
    month: "long", // Valid values: "numeric", "2-digit", "narrow", "short", "long"
    day: "numeric", // Valid values: "numeric", "2-digit"
    hour: "2-digit", // Valid values: "numeric", "2-digit"
    minute: "2-digit", // Valid values: "numeric", "2-digit"
    timeZoneName: "short", // Valid values: "short", "long"
  };

  useEffect(() => {
    if (product) console.log(product);
  }, [product]);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "4rem",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            Loading product details...
          </div>
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            role="status"
            aria-hidden="true"
          />
        </div>
      ) : error ? (
        <>
          <div>Error loading product details:</div>
          <h2>{error}</h2>)
        </>
      ) : (
        <></>
      )}

      <Container>
        <AddedToCartMessageComponent
          showCartMessage={showCartMessage}
          setShowCartMessage={setShowCartMessage}
        />
        <Row className="mt-5">
          {!loading && (
            <>
              <Col style={{ zIndex: 1 }} md={4}>
                {product?.images?.map((image, id) => (
                  <div style={{ marginBottom: "2rem" }} key={id}>
                    <Image
                      crossOrigin="anonymous"
                      fluid
                      src={image?.imageUrl ?? ""}
                    />
                    <br />
                  </div>
                ))}
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={8}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h1>{product?.name}</h1>
                      </ListGroup.Item>
                      <ListGroup.Item>
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
                        <div style={{ marginTop: "1rem" }}>
                          {productReviewScore.toFixed(2)} Average Rating
                        </div>
                        <div>
                          {product?.reviews?.length ?? 0}{" "}
                          {product?.reviews?.length === 1
                            ? "review"
                            : "reviews"}
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Price{" "}
                        <span className="fw-bold">
                          ${(product?.price ?? 0).toFixed(2)}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>{product?.description}</ListGroup.Item>
                    </ListGroup>
                  </Col>
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
                        <span className="fw-bold">
                          ${(product?.price ?? 0).toFixed(2)}
                        </span>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        Quantity:
                        <Form.Select
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value as any)}
                          size="lg"
                          aria-label="Default select example"
                        >
                          {[...Array(product?.count).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Button
                          type="button"
                          onClick={addToCartHandler}
                          variant="danger"
                        >
                          Add to cart
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-5">
                    <h5>REVIEWS</h5>
                    <ListGroup variant="flush">
                      {product?.reviews?.map((review, idx) => (
                        <ListGroup.Item
                          key={idx}
                          style={{ marginBottom: "1rem" }}
                        >
                          <div>
                            {review?.user?.name} {review?.user?.lastName} -{" "}
                            {review?.rating?.toFixed(1)}
                          </div>
                          <div style={{ marginBottom: "0.5rem" }}>
                            <Rating
                              readonly
                              size={20}
                              ratingValue={review?.rating ?? 0}
                              onClick={() => null}
                            />
                          </div>

                          <div style={{ marginBottom: "0.5rem" }}>
                            {new Intl.DateTimeFormat(
                              undefined,
                              dateOptions
                            ).format(
                              new Date(review?.createdAt?.toString() ?? "")
                            )}
                          </div>
                          <div>{review?.comment}</div>
                        </ListGroup.Item>
                      ))}
                      <div ref={messagesEndRef} />
                    </ListGroup>
                  </Col>
                </Row>
                <hr />
                {!userInfo?.name && (
                  <Alert variant="danger">Login first to write a review</Alert>
                )}

                <Form onSubmit={sendReviewHandler}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Write a review</Form.Label>
                    <Form.Control
                      name="comment"
                      required
                      as="textarea"
                      disabled={!userInfo.name}
                      rows={3}
                    />
                  </Form.Group>
                  <Form.Select
                    name="rating"
                    required
                    disabled={!userInfo.name}
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
                    disabled={!userInfo.name}
                    type="submit"
                    className="mb-3 mt-3"
                    variant="primary"
                  >
                    Submit
                  </Button>{" "}
                  {productReviewed && (
                    <div style={{ color: "green" }}>
                      {productReviewed}
                    </div>
                  )}
                  {productReviewErrorMessage !== "" && (
                    <div style={{ color: "red" }}>
                      {productReviewErrorMessage}
                    </div>
                  )}
                </Form>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
};

export default ProductDetailsPageComponent;
