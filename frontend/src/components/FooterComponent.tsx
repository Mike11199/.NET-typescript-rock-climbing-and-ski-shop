import { Container, Row, Col } from "react-bootstrap";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container fluid>
        <Row>
          <Col className="text-white text-center py-5">
            {/*  https://getbootstrap.com/docs/5.1/utilities/colors/  */}
            Copyright {currentYear} &copy; Rock Climbing & Ski Shop - Michael
            Iwanek
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;
