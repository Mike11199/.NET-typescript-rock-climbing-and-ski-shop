import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const styles = {
  card: {
    boxShadow:"5px 0px 15px black",
    border: "5px black"
    // borderRadius: 55,
    // padding: '3rem'
  },
  cardImage: {
    height: "10px",    
  }
}

const stylesDark = {
  card: {
    boxShadow:"5px 0px 15px black",
    border: "5px black",
    color: 'white',
    backgroundColor:'black'
    // borderRadius: 55,
    // padding: '3rem'
  },
  cardImage: {
    height: "10px",    
  }
}



const CategoryCardComponent = ({ category, idx }) => {

  const { mode }  = useSelector((state) => state.DarkMode)
  // console.log('card component')
  // console.log(mode.mode.mode)
  const cardStyle = mode === 'dark' ? stylesDark.card : styles.card;
  

  return (
    <>
      <Card style={cardStyle}>
        <LinkContainer to={`/product-list/category/${category.name}`}>
          <img
            src={category.image ?? null}
            height="365px"
            style={styles.cardImage}
          ></img>
        </LinkContainer>
        <Card.Body>
          <Card.Title>{category.name}</Card.Title>
          <Card.Text>{category.description}</Card.Text>
          {/* <LinkContainer to={`/product-list/category/${category.name}`}>
          <Button type="button" variant="primary" style={{ touchAction: 'manipulation' }}>Go to the Category</Button>
        </LinkContainer> */}
        <Link to={`/product-list/category/${category.name}`}>
          <button
            type="button"
            class="btn btn-primary"
            style={{ touchAction: "manipulation" }}
            onClick={() =>
              (window.location.href = `/product-list/category/${category.name}`)
            }
          >
            Go to the Category
          </button>
        </Link>
        </Card.Body>
      </Card>
    </>
  );
};

export default CategoryCardComponent;

