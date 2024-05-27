import { Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../src/mobileStyles.css";
import { ReduxAppState } from "types";

const styles = {
  card: {
    boxShadow: "5px 0px 15px black",
    border: "5px black",
    touchAction: "manipulation",
    userSelect: "none",
  },
  cardImage: {},
};

const stylesDark = {
  card: {
    boxShadow: "5px 0px 15px black",
    border: "5px black",
    color: "white",
    backgroundColor: "black",
    touchAction: "manipulation",
    userSelect: "none",
  },
  cardImage: {},
};

const CategoryCardComponent = ({ category, idx }) => {
  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);
  const cardStyle = mode === "dark" ? stylesDark.card : styles.card;

  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    navigate(
      `/product-list?pageNum=1&category=${encodeURIComponent(categoryName)}`,
    );
  };

  return (
    <>
      <Card style={cardStyle as any}>
        <LinkContainer
          to={`/product-list?pageNum=1&category=${encodeURIComponent(category.name)}`}
        >
          <img
            src={category.image ?? null}
            height="365px"
            key={category.name}
            className={`category_card_image_front_page_${category.name.toLowerCase()}`}
            alt="category"
          ></img>
        </LinkContainer>
        <Card.Body style={{ touchAction: "manipulation", userSelect: "none" }}>
          <Card.Title style={{ userSelect: "text" }}>
            {category.name}
          </Card.Title>
          <Card.Text style={{ userSelect: "text" }}>
            {category.description}
          </Card.Text>
          <button
            type="button"
            className="btn btn-primary"
            style={{ touchAction: "manipulation", userSelect: "none" }}
            onClick={() => handleClick(category.name)}
          >
            Shop Now
          </button>
        </Card.Body>
      </Card>
    </>
  );
};

export default CategoryCardComponent;
