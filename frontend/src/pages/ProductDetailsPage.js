import {
  Row,
  Col,
  Container,
  Image,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import AddedToCartMessageComponent from "../components/AddedToCartMessageComponent";
import ImageZoom from "js-image-zoom";
import { useEffect } from "react";

const ProductDetailsPage = () => {
  
  let options = {
    scale: 2,
    offset: {vertical: 0, horizontal: 0},
  }

  useEffect(()=> {

    new ImageZoom(document.getElementById("first"), options)
    new ImageZoom(document.getElementById("second"), options)
    new ImageZoom(document.getElementById("third"), options)
    new ImageZoom(document.getElementById("fourth"), options)

  })

  return (
    <Container>
      <AddedToCartMessageComponent />
      <Row className="mt-5">
        
        {/* Images of Product */}
        <Col style={{zIndex: 1}} md={4}>
          {/* https://react-bootstrap.netlify.app/components/images/#rb-docs-content */}
          
          <div style={{marginBottom: "10px"}} id="first">
          <Image fluid crossOrigin="anonymous" src="/images/monitors-category.png" />  
          </div>
          <div style={{marginBottom: "10px"}} id="second">
            <Image fluid crossOrigin="anonymous" src="/images/tablets-category.png" />       
          </div>
          <div style={{marginBottom: "10px"}} id="third">
            <Image fluid crossOrigin="anonymous" src="/images/games-category.png" />       
          </div>
          <div style={{marginBottom: "10px"}} id="fourth">
            <Image fluid crossOrigin="anonymous" src="/images/tablets-category.png" />       
          </div>
        </Col>

        <Col md={8}>
          <Row>
            <Col md={8}>
              {/* https://react-bootstrap.netlify.app/components/list-group/#flush */}
              <ListGroup variant="flush">
                <ListGroup.Item><h1>Product name</h1></ListGroup.Item>
                <ListGroup.Item>
                  <Rating readonly size={20} initialValue={4} /> (1)
                </ListGroup.Item>
                <ListGroup.Item>Price <span className="fw-bold">$395</span></ListGroup.Item>
                <ListGroup.Item>
                  Porta ac consectetur ac lorem ipsum dolor, sit amet consectetur adipicising elit. Perferendis ilio.
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup>
                {/* ListGroup for quantity/price/add to cart button */}
                <ListGroup.Item>Status:  In stock</ListGroup.Item>
                <ListGroup.Item>Price: <span className="fw-bold">$395</span></ListGroup.Item>
                <ListGroup.Item>
                  Quantity:
                  {/*https://react-bootstrap.netlify.app/forms/select/#sizing */}
                  <Form.Select size="lg" aria-label="Default select example">
                    <option>1</option>
                    <option value="1">2</option>
                    <option value="2">3</option>
                    <option value="3">4</option>
                  </Form.Select>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="danger">Add to Cart</Button>
                </ListGroup.Item>                
              </ListGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mt-5">
              <h5>REVIEWS</h5>
              <ListGroup variant="flush">
                {Array.from({length: 10}).map((item,idx) => (
                  <ListGroup.Item key={idx}>                    
                    John Doe <br />
                    <Rating readonly size={20} initialValue={4}/>
                    <br />
                    11-25-2022 <br />
                    consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur. 
                  </ListGroup.Item>
                ))}
                
              </ListGroup>
            </Col>
          </Row>
          <hr />
          <Alert variant="danger">Login first to write a review</Alert>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              
              <Form.Label>Write a Review</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Select aria-label="Default select example">
              <option>Your rating</option>
              <option value="5">5 (very good)</option>
              <option value="4">4 (good)</option>
              <option value="3">3 (average)</option>
              <option value="2">2 (bad)</option>
              <option value="1">1 (awful)</option>
            </Form.Select>
            <Button className="mb-3 mt-3" variant="primary">Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailsPage;

