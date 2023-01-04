import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AdminLinksComponent = () => {
  return (
    <Navbar bg="light" variant="light">
      <Nav className="flex-column">
        <LinkContainer to="/admin/orders">
          <Nav.Link>Orders</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/products">
          <Nav.Link>Products</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/users">
          <Nav.Link>Users</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/chats">
          <Nav.Link>Chats</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/analytics">
          <Nav.Link>Analytics</Nav.Link>
        </LinkContainer>
        <Nav.Link>Logout</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default AdminLinksComponent;

