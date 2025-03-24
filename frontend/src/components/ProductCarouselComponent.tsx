import { Carousel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { BestsellerItem, Image } from "types";

interface ProductCarouselComponentProps {
  bestSellers: BestsellerItem[];
}

const ProductCarouselComponent = ({
  bestSellers,
}: ProductCarouselComponentProps) => {
  const cursorPointerStyle = {
    cursor: "pointer",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  return Array.isArray(bestSellers) && bestSellers?.length > 0 ? (
    <Carousel>
      {Array.isArray(bestSellers) &&
        bestSellers?.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              crossOrigin="anonymous"
              className="d-block w-100"
              style={{
                height: "300px",
                objectFit: "contain",
                filter: "drop-shadow(10px 10px 20px rgba(0, 0, 0, 1))",
              }}
              src={
                item?.images?.find((x: Image) => x?.isMainImage === true)
                  ?.imageUrl ?? ""
              }
              alt={item?.name ?? ""}
            />
            <Carousel.Caption>
              <LinkContainer
                style={cursorPointerStyle}
                to={`/product-details/${item?.productId}`}
              >
                <h3 className="orderDetailsHeader">Bestseller in {item?.category?.name} Category</h3>
              </LinkContainer>
              <p className="carousel_caption_text">{item?.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
    </Carousel>
  ) : null;
};

export default ProductCarouselComponent;
