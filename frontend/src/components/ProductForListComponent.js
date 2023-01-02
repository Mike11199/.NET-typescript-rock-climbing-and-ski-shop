import { Card, Button, Row, Col } from "react-bootstrap";

const ProductForListComponent = () => {
  // https://react-bootstrap.netlify.app/components/cards/#rb-docs-content
  return (
    <Card style={{ marginTop: "30px", marginBottom:"50px" }}>
      {/* default width of row is 12: 5 + 7 = 12 */}
      <Row>
        <Col lg={5}>
          <Card.Img variant="top" src="/images/tablets-category.png" />
        </Col>
        <Col lg={7}>
        <Card.Body>
        <Card.Title>Product Name Lorem Ipsum</Card.Title>
        <Card.Text>
        perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta 
        sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem 
        ipsum quia dolor sit amet, consectetur, adipisc
        </Card.Text>        
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
        </Col>
      </Row>

    </Card>
  );
};

export default ProductForListComponent;
