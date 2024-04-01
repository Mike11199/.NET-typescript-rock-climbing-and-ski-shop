import { Card, Button, Row, Col } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions"; //redux action
import toast, { Toaster } from "react-hot-toast";
import { ReduxAppState } from "types";

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

  const addToCartHandler = async () => {
    try {
      await dispatch(addToCart(productId, 1));

      toast.success("Added item to cart!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Error adding item to cart.", {
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
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

  return (
    <>
      <Toaster />
      <Card style={productCardStyle}>
        <Row>
          <Col lg={5}>
            <Card.Img
              crossOrigin="anonymous"
              variant="top"
              src={images[0] ? images[0]?.path ?? images[0]?.imageUrl : ""}
            />
          </Col>
          <Col lg={7}>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <Card.Text>
                <Rating
                  readonly
                  onClick={() => null}
                  ratingValue={rating}
                  size={20}
                />{" "}
                ({reviewsNumber})
              </Card.Text>
              <Card.Text>
                ${price.toFixed(2)}
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
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ProductForListComponent;
