
import { Container, Row, Col } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer>
      <Container fluid>
        <Row className="mt-5">
          <Col className="bg-dark text-white text-center py-5">
              {/*  https://getbootstrap.com/docs/5.1/utilities/colors/  */}
            Copyright &copy; Rock Climbing & Ski Shop
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;

