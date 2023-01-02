import { Navbar, Nav, Container, NavDropdown, Badge, Form, Dropdown, DropdownButton, Button, InputGroup } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap' //makes a react bootstrap element behave like a react router link 
import { Link } from 'react-router-dom'

const HeaderComponent = () => {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand href="/">Rock Climbing & Ski Shop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            
            <Nav className="me-auto">
                <InputGroup>
                    <DropdownButton id="dropdown-basic-button" title="All">
                        <Dropdown.Item>Ropes</Dropdown.Item>
                        <Dropdown.Item>Skis</Dropdown.Item>
                        <Dropdown.Item>Harnesses</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control type="text" placeholder="Search in shop..." />
                    <Button variant="warning">
                        <i className="bi bi-search text-dark"></i>
                    </Button>
                </InputGroup>
            </Nav>

            <Nav>
            <LinkContainer to="/admin/orders">
              <Nav.Link>
                Admin
                <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
              </Nav.Link>
            </LinkContainer>
              
              <Nav.Link href="#pricing">
                <Badge pill bg="danger">
                    2
                </Badge>
                Cart
              </Nav.Link>
              <NavDropdown title="John Doe" id="collapsible-nav-dropdown">
                <NavDropdown.Item eventKey="/user/my-orders" as={Link} to="/user/my-orders">My orders</NavDropdown.Item>
                <NavDropdown.Item eventKey="/user/" as={Link} to="/user">My profile</NavDropdown.Item>
                <NavDropdown.Item>Logout</NavDropdown.Item>


              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default HeaderComponent;
