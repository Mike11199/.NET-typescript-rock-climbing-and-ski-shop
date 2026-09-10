import { Nav, NavDropdown, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { ReduxAppState } from "types";

const HeaderNavLinks = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector(
    (state: ReduxAppState) => state.userRegisterLogin,
  );
  const itemsCount = useSelector(
    (state: ReduxAppState) => state.cart.itemsCount,
  );

  return (
    <Nav>
      <div className="nav-links-container">
        {userInfo?.name ? (
          <NavDropdown
            title={`${userInfo.name} ${userInfo.lastName}`}
            id="collasible-nav-dropdown"
          >
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
        ) : (
          <>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>
          </>
        )}

        <LinkContainer to="/cart" style={{ whiteSpace: "nowrap" }}>
          <Nav.Link>
            <Badge pill bg="danger">
              {itemsCount === 0 ? "" : itemsCount}
            </Badge>
            <i className="bi bi-cart-dash"></i>
            <span className="ms-1">CART</span>
          </Nav.Link>
        </LinkContainer>
      </div>
    </Nav>
  );
};

export default HeaderNavLinks;
