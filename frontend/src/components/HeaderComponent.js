import { Navbar, Nav, Container, NavDropdown, Badge, Form, DropdownButton, Dropdown, Button, InputGroup } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { Link } from "react-router-dom"
import { logout } from "../redux/actions/userActions"
import { useDispatch, useSelector } from "react-redux"

const HeaderComponent = () => {
  
  
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.userRegisterLogin)  //retrieve global state (redux) to toggle admin/user links on header
  const itemsCount = useSelector((state) => state.cart.itemsCount);

   return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>

        {/* STORE NAME */}
        <LinkContainer to="/">
          <Navbar.Brand href="/">Rock Climbing & Ski Shop</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup>

              {/* DROPDOWN TO SEARCH IN A SPECIFIC CATEGORY */}
              <DropdownButton id="dropdown-basic-button" title="All">
                <Dropdown.Item>Ropes</Dropdown.Item>
                <Dropdown.Item>Harnesses</Dropdown.Item>
                <Dropdown.Item>Skis</Dropdown.Item>               
                <Dropdown.Item>Tents</Dropdown.Item>
                <Dropdown.Item>Backpacks</Dropdown.Item>
                <Dropdown.Item>Jackets</Dropdown.Item>
              </DropdownButton>

              {/* SEARCH INPUT AND SEARCH BUTTON*/}
              <Form.Control type="text" placeholder="Search in shop ..." />
              <Button variant="warning">
                <i className="bi bi-search text-dark"></i>
              </Button>
            </InputGroup>
          </Nav>
          <Nav>


            {/* CONDITIONAL RENDERING OF HEADER LINKS SECTION */}
            {userInfo && userInfo.isAdmin ? 
            //IF AN ADMIN, DISPLAY THE LINK TO THE ADMIN ORDERS PAGE AND CONTROL PANEL 
            (
              //admin link to admin control panel
              <LinkContainer to="/admin/orders">
                <Nav.Link>
                  Admin
                  <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle">                    
                  </span>
                </Nav.Link>
              </LinkContainer>
            
            // ELSE IF NOT AN ADMIN AND USER HAS A NAME, DISPLAY FIRST AND LAST NAME FOR DROPDOWN 
            ) : userInfo && userInfo.name && !userInfo.isAdmin ? 
            (
              //drop down for user to show order; profile; logout
              <NavDropdown title={`${userInfo.name} ${userInfo.lastName}`} id="collasible-nav-dropdown">
                <NavDropdown.Item
                  eventKey="/user/my-orders"
                  as={Link}
                  to="/user/my-orders"
                >
                  My orders
                </NavDropdown.Item>
                <NavDropdown.Item eventKey="/user" as={Link} to="/user">
                  My profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logout())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>

            // ELSE DISPLAY THE LOGIN AND REGISTER LINKS
            ) : 
            (
              //login and register links
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
            {/* CONDITIONAL RENDERING - SECTION END*/}

            <LinkContainer to="/cart">
              <Nav.Link>
                <Badge pill bg="danger">
                {itemsCount === 0 ? "" : itemsCount}
                </Badge>
                <i className="bi bi-cart-dash"></i>
                <span className="ms-1">CART</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;

