import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../src/mobileStyles.css";

const CategoryCardComponent = ({ category, idx }) => {
  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    navigate(
      `/product-list?pageNum=1&category=${encodeURIComponent(categoryName)}`
    );
  };

  return (
    <>
      <Card className="category_card">
        <img
          src={category.image ?? ""}
          alt="category"
          className={`category_card_image_front_page`}
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(
              `/product-list?pageNum=1&category=${encodeURIComponent(category.name)}`
            )
          }
        />
        <Card.Body style={{ touchAction: "manipulation", userSelect: "none" }}>
          <Card.Title style={{ userSelect: "text" }}>
            {category.name}
          </Card.Title>
          <Card.Text style={{ userSelect: "text" }}>
            {category.description}
          </Card.Text>
          <button
            type="button"
            className="primary-button-blue"
            style={{ touchAction: "manipulation", userSelect: "none" }}
            onClick={() => handleClick(category.name)}
          >
            Shop
          </button>
        </Card.Body>
      </Card>
    </>
  );
};

export default CategoryCardComponent;
