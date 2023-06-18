import { Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../../frontend/src/mobileStyles.css'


const styles = {
  card: {
    boxShadow:"5px 0px 15px black",
    border: "5px black",
    // borderRadius: 55,
    // padding: '3rem'
    touchAction: "manipulation", 
    userSelect: "none"
  },
  cardImage: {
       
  }
}

const stylesDark = {
  card: {
    boxShadow:"5px 0px 15px black",
    border: "5px black",
    color: 'white',
    backgroundColor:'black',
    touchAction: "manipulation", 
    userSelect: "none"
    // borderRadius: 55,
    // padding: '3rem'
  },
  cardImage: {
    
  }
}



const CategoryCardComponent = ({ category, idx }) => {

  const { mode }  = useSelector((state) => state.DarkMode)
  // console.log('card component')
  // console.log(mode.mode.mode)
  const cardStyle = mode === 'dark' ? stylesDark.card : styles.card;
  
  const navigate = useNavigate();

  const handleClick = (categoryName) => {
    navigate(`/product-list/category/${categoryName}`);
  }

  return (
    <>
      <Card style={cardStyle} >
        <LinkContainer to={`/product-list/category/${category.name}`}>
          <img
            src={category.image ?? null}
            height="365px"
            key={category.name}
            className={`category_card_image_front_page_${category.name.toLowerCase()}`}
            alt="category"
          ></img>
        </LinkContainer>
        <Card.Body style={{ touchAction: "manipulation", userSelect: "none", }}>
          <Card.Title style={{ userSelect: "text" }}>{category.name}</Card.Title>
          <Card.Text style={{ userSelect: "text" }}>{category.description}</Card.Text>
          {/* <LinkContainer to={`/product-list/category/${category.name}`}>
          <Button type="button" variant="primary" style={{ touchAction: 'manipulation' }}>Go to the Category</Button>
        </LinkContainer> */}
        {/* <Link to={`/product-list/category/${category.name}`} style={{ touchAction: "manipulation"}}> */}
          <button
            type="button"
            class="btn btn-primary"
            style={{ touchAction: "manipulation", userSelect: "none",}}
            // onClick={() =>
            //   (window.location.href = `/product-list/category/${category.name}`)
            // }
            onClick={() => handleClick(category.name)}
          >
            Go to the Category
          </button>
        {/* </Link> */}
        </Card.Body>
      </Card>
    </>
  );
};

export default CategoryCardComponent;