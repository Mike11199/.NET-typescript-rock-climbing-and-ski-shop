import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CategoryCardComponent = ({ category, idx }) => {
  const images = [
    "/images/tablets-category.png",
    "/images/monitors-category.png",
    "/images/games-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
    "/images/tablets-category.png",
  ];
  return (
    <Card>
      <Card.Img crossorigin="anonymous" variant="top" src={images[idx]} />
      <Card.Body>
        <Card.Title>{category}</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <LinkContainer to="/product-list">
          <Button variant="primary">Go to the Category</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
};

export default CategoryCardComponent;

