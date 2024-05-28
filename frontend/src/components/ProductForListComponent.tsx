import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions"; //redux action
import { ReduxAppState, Image } from "types";
import { toastAddedToCart, toastError } from "../../src/utils/ToastNotifications";
import { useNavigate } from "react-router-dom";

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

  const addToCartHandler = async () => {
    try {
      await dispatch(addToCart(productId, 1));
      toastAddedToCart('Added to cart!', navigate)

    } catch (error) {
      toastError("Error adding item to cart.");
    }
  };

  const styles = {
    color: "black",
    backgroundColor: "white",
    marginTop: "30px",
    marginBottom: "50px",
  };

  const darkStyles = {
    color: "white",
    backgroundColor: "black",
    marginTop: "30px",
    marginBottom: "50px",
  };

  const productCardStyle = mode === "light" ? styles : darkStyles;
  const mainThumbnailImage = images.find((x: Image) => x?.isMainImage === true);

  return (
    <>
      <Card style={productCardStyle}>
        <Row>
          <Col lg={5}>
            <Card.Img
              crossOrigin="anonymous"
              variant="top"
              src={mainThumbnailImage?.imageUrl}
            />
          </Col>
          <Col lg={7}>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <div style={{ marginBottom: "0.5rem", marginTop: "0.5rem" }}>
                Price <span className="fw-bold">${price.toFixed(2)}</span>
              </div>
              <div>
                <Rating
                  readonly
                  onClick={() => null}
                  ratingValue={rating}
                  size={20}
                />{" "}
              </div>

              <div style={{ marginTop: "0.5rem" }}>{reviewsNumber} Reviews</div>
              <div>{rating} Average Rating</div>
              <div style={{ marginTop: "0.5rem" }}>
                <div className="product_list_buttons">
                  <LinkContainer to={`/product-details/${productId}`}>
                    <Button type="button" variant="danger">
                      See product
                    </Button>
                  </LinkContainer>
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => addToCartHandler()}
                  >
                    Add to cart
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ProductForListComponent;
