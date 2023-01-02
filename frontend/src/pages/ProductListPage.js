import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import SortOptionsComponent from "../components/SortOptionsComponent";
import PriceFilterComponent from "../components/filterQueryResultOptions/PriceFilterComponent";

const ProductListPage = () => {

    return (
        <Container fluid>
        {/* row default width = 12 :  9 + 3 = 12 for columns*/}
        <Row>
        {/* width of 3 for the side panel - this container sorting/filtering options; md is is mobile responsive if below medium size device */}
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item><SortOptionsComponent /></ListGroup.Item>
              <ListGroup.Item><PriceFilterComponent /></ListGroup.Item>
              <ListGroup.Item>category</ListGroup.Item>
              <ListGroup.Item>test</ListGroup.Item>
              <ListGroup.Item>
                test
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="primary">Primary</Button>
                <Button variant="danger">Danger</Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          {/* width of 9 to show all the products (component) and pagination (other component) */}
          <Col md={9}>
            products go here
            pagination component here
          </Col>
        </Row>
      </Container>
    )
}

export default ProductListPage