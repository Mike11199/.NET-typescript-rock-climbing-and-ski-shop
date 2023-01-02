import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";

const ProductListPage = () => {

    return (
        <Container fluid>
        <Row>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>test</ListGroup.Item>
              <ListGroup.Item>test</ListGroup.Item>
              <ListGroup.Item>test</ListGroup.Item>
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
          <Col md={9}>
            test
            test
          </Col>
        </Row>
      </Container>
    )
}

export default ProductListPage