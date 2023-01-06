import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import ProductForListComponent from "../../components/ProductForListComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent";

import { useEffect, useState } from "react";


const ProductListPageComponent = ({getProducts}) => {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts()
        .then(products => setProducts(products.products))
        .catch((er) => console.log(er));
    }, [])

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-3 mt-3">
              <SortOptionsComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              FILTER: <br />
              <PriceFilterComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              <CategoryFilterComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              <AttributesFilterComponent />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary">Filter</Button>{" "}
              <Button variant="danger">Reset filters</Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {products.map((product) => (
            <ProductForListComponent
              key={product._id}
              images={product.images}
              name={product.name}
              description={product.description}
              price={product.price}
              rating={product.rating}
              reviewsNumber={product.reviewsNumber}
              productId={product._id}
            />
          ))}
          <PaginationComponent />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPageComponent;

