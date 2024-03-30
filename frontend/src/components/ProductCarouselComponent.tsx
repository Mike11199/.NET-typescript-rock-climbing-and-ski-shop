import { Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { BestsellerItem } from "types";

interface ProductCarouselComponentProps {
  bestSellers: BestsellerItem[];
}

const ProductCarouselComponent = ({
  bestSellers,
}: ProductCarouselComponentProps) => {
  const cursorPointerStyle = {
    cursor: "pointer",
    color: "white",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  };

  return Array.isArray(bestSellers) && bestSellers?.length > 0 ? (
    <Carousel>
      {Array.isArray(bestSellers) &&
        bestSellers?.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              crossOrigin="anonymous"
              className="d-block w-100"
              style={{ height: "300px", objectFit: "contain" }}
              src={item?.images?.length != 0 ? (item?.images?.at(0)?.imageUrl ?? "") : ""}
              alt={item?.name ?? ""}
            />
            <Carousel.Caption>
              <LinkContainer
                style={cursorPointerStyle}
                to={`/product-details/${item?.productId}`}
              >
                <h3>Bestseller in {item?.category?.name} Category</h3>
              </LinkContainer>
              <p className="carousel_caption_text">{item?.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
    </Carousel>
  ) : null;
};

export default ProductCarouselComponent;
