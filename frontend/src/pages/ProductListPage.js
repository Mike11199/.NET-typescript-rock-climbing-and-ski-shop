import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import SortOptionsComponent from "../components/SortOptionsComponent";
import PriceFilterComponent from "../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../components/filterQueryResultOptions/AttributesFilterComponent";
import ProductForListComponent from "../components/ProductForListComponent";
import PaginationComponent from "../components/PaginationComponent";
import {RatingView} from 'react-simple-star-rating'

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
              <ListGroup.Item><RatingFilterComponent/></ListGroup.Item>
              <ListGroup.Item><CategoryFilterComponent/></ListGroup.Item>
              <ListGroup.Item><AttributesFilterComponent/></ListGroup.Item>
              <ListGroup.Item>
                <Button variant="primary">Primary</Button>
                <Button variant="danger">Danger</Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          {/* width of 9 to show all the products (component) and pagination (other component) */}
          <Col md={9}>
            <ProductForListComponent />
            <PaginationComponent />
          </Col>
        </Row>
      </Container>
    )
}

export default ProductListPage