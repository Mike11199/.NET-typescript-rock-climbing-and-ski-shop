import {Carousel} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

const ProductCarouselComponent = () => {
  
  const cursorP = {
    cursor:"pointer"
  }

  return (
    <Carousel>
      <Carousel.Item>
        <img
          crossOrigin="anonymous"
          className="d-block w-100"
          style={{height: "300px", objectFit:'cover'}}
          src="/images/carousel/carousel-1.png"
          alt="First slide"
        />
        <Carousel.Caption>
          <LinkContainer style={cursorP} to="/product-details">
          <h3>Bestseller in Harnesses Category</h3>
          </LinkContainer>          
          <p>Climbing Harness Big Wall 5000</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{height: "300px", objectFit:'cover'}}
          src="/images/carousel/carousel-2.png"
          alt="Second slide"
        />

        <Carousel.Caption>
        <LinkContainer style={cursorP} to="/product-details">
          <h3>Bestseller in Books Category</h3>
          </LinkContainer>  
          <p>Freedom of the Hills</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{height: "300px", objectFit:'cover'}}
          src="/images/carousel/carousel-3.png"
          alt="Third slide"
        />

        <Carousel.Caption>
        <LinkContainer style={cursorP} to="/product-details">
          <h3>Bestseller in Cameras Category</h3>
          </LinkContainer>  
          <p>
            4k Camera
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarouselComponent;

