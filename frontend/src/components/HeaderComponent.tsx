import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import React from "react";

import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories } from "../redux/actions/categoryActions";
import socketIOClient from "socket.io-client";
import {
  setChatRooms,
  setSocket,
  setMessageReceived,
  removeChatRoom,
} from "../redux/actions/chatActions";
import { setDarkMode } from "../redux/actions/darkModeActions";
import "../darkMode.css";
import { ReduxAppState } from "types";

const HeaderComponent = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector(
    (state: ReduxAppState) => state.userRegisterLogin
  );
  const itemsCount = useSelector(
    (state: ReduxAppState) => state.cart.itemsCount
  );
  const { categories } = useSelector(
    (state: ReduxAppState) => state.getCategories
  );

  const { messageReceived } = useSelector(
    (state: ReduxAppState) => state.adminChat
  );

  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);
  const [buttonPositionClass, setButtonPositionClass] =
    useState("position-absolute");

  const navigate = useNavigate();

  const extractCategoryName = (pathname) => {
    const match = pathname.match(/\/product-list\/category\/([^/]+)/);
    return match ? match[1] : null;
  };

  const location = useLocation();
  const categoryName = extractCategoryName(location.pathname);

  useEffect(() => {
    if (categoryName != undefined) setSearchCategoryToggle(categoryName);
  }, [categoryName]);

  // dark mode change redux state of mode
  const toggleTheme = () => {
    if (mode === "light") {
      dispatch(setDarkMode("dark"));
    } else {
      dispatch(setDarkMode("light"));
    }
  };

  // change document body class if mode changes
  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  // useEffect - Getting categories for the header menu drop down - search menu
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchCategoryToggle === "All") {
        navigate(`/product-list/search/${searchQuery}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle.replaceAll(
            "/",
            ","
          )}/search/${searchQuery}`
        );
      }
    } else if (searchCategoryToggle !== "All") {
      navigate(
        `/product-list/category/${searchCategoryToggle.replaceAll("/", ",")}`
      );
    } else {
      navigate("/product-list");
    }
  };

  useEffect((): any => {
    if (userInfo?.isAdmin) {
      let audio = new Audio("/audio/chat-msg.mp3");
      const socket = socketIOClient();

      // this emits something when the admin is logged in
      socket.emit(
        "admin connected with server",
        "Admin" + Math.floor(Math.random() * 1000000000000)
      );

      // this is an example of a chatroom - array of conversation between client and admin.
      // eg. - let chatRooms = {XDfXCdf54gfgSocketID: [{ "client" : "first msg" }, { "client" : "2nd message" }, { "admin" : "response" } ],}

      // this allows server to listen for server receiving client message to admin - also set in redux
      socket.on(
        "server sends message from client to admin",
        ({ user, message }) => {
          dispatch(setSocket(socket));
          dispatch(setChatRooms(user, message));
          dispatch(setMessageReceived(true));
          audio.play();
        }
      );

      socket.on("disconnected", ({ reason, socketId }) => {
        // console.log(socketId, reason)
        dispatch(removeChatRoom(socketId));
      });

      return () => socket.disconnect(); //if we leave the page/website socket will disconnect ( as header s/b on every page )
    }
  }, [userInfo?.isAdmin]);

  //cheating with this to resize dark mode button as don't want to add media queries to CSS file
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1577) {
        // Change to your desired breakpoint
        setButtonPositionClass("position-relative");
      } else {
        setButtonPositionClass("position-absolute");
      }
    };
    handleResize(); // Set the initial class on mount
    window.addEventListener("resize", handleResize); // Add the listener
    return () => window.removeEventListener("resize", handleResize); // Remove the listener on unmount
  }, []);

  const DarkModeToggleButton = () => {
    return mode === "light" ? (
      <Button
        variant="danger"
        className={`${buttonPositionClass} top-10 start-0`}
        style={{ marginLeft: "1%" }}
        onClick={toggleTheme}
      >
        Dark Mode
      </Button>
    ) : (
      <Button
        variant="danger"
        className={`${buttonPositionClass} top-10 start-0`}
        style={{ marginLeft: "1%" }}
        onClick={toggleTheme}
      >
        Light Mode
      </Button>
    );
  };

  const DesktopNavBar = () => {
    return (
      <>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup>
              <DropdownButton
                id="dropdown-basic-button"
                title={CategoryButtonText()}
              >
                <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                  All
                </Dropdown.Item>
                {categories.map((category, id) => (
                  <Dropdown.Item
                    key={id}
                    onClick={() => setSearchCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                onKeyUp={submitHandler}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search in shop ..."
              />
              <Button onClick={submitHandler} variant="warning">
                <i className="bi bi-search text-dark"></i>
              </Button>
            </InputGroup>
          </Nav>
          <Nav style={{marginLeft: "15vw"}}>
            {userInfo?.isAdmin ? (
              <LinkContainer to="/admin/orders">
                <Nav.Link>
                  Admin
                  {messageReceived && (
                    <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
                  )}
                </Nav.Link>
              </LinkContainer>
            ) : userInfo?.name && !userInfo?.isAdmin ? (
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
      </>
    );
  };

  const DesktopMainTitleContainer = () => {
    return (
      <LinkContainer to="/">
        <Navbar.Brand onClick={() => setSearchCategoryToggle("All")} href="/">
          🏔 Alpine Peak Climbing and Ski Gear
        </Navbar.Brand>
      </LinkContainer>
    );
  };
  const MobileMainTitleContainer = () => {
    return (
      <LinkContainer to="/">
        <Navbar.Brand onClick={() => setSearchCategoryToggle("All")} href="/">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              height: "1rem",
              maxHeight: "fit-content",
            }}
          >
            🏔 Alpine Peak Climbing and Ski Gear
          </div>
        </Navbar.Brand>
      </LinkContainer>
    );
  };

  const MobileTopContainer = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: "1rem 0rem 1rem 0rem",
        }}
      >
        <div style={{ width: "100%" }}>
          <MobileMainTitleContainer />
        </div>
        <div style={{ width: "100%" }}>
          <Nav
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {userInfo?.isAdmin ? (
              <LinkContainer to="/admin/orders">
                <Nav.Link>
                  Admin
                  {messageReceived && (
                    <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
                  )}
                </Nav.Link>
              </LinkContainer>
            ) : userInfo?.name && !userInfo?.isAdmin ? (
              <>
                <LinkContainer to="/user/my-orders">
                  <Nav.Link>My orders</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/user">
                  <Nav.Link>My profile</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/logout" onClick={() => dispatch(logout())}>
                  <Nav.Link>Logout</Nav.Link>
                </LinkContainer>
              </>
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
        </div>
      </div>
    );
  };

  const CategoryButtonText = () => {
    return (
      <>
        {categories?.length === 0 && (
          <Spinner
            as="span"
            animation="border"
            variant="dark"
            role="status"
            aria-hidden="true"
            size="sm"
          />
        )}
        {categories?.length !== 0 && searchCategoryToggle}
      </>
    );
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <div className="desktop-view-header">
          <DesktopMainTitleContainer />
          <DarkModeToggleButton />
          <DesktopNavBar />
        </div>
        <div className="mobile-view-header">
          <MobileTopContainer />
          <div style={{ marginBottom: "2rem" }}>
          <InputGroup>
            <DropdownButton
              id="dropdown-basic-button"
              title={CategoryButtonText()}
            >
              <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                All
              </Dropdown.Item>
              {categories.map((category, id) => (
                <Dropdown.Item
                  key={id}
                  onClick={() => setSearchCategoryToggle(category.name)}
                >
                  {category.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Form.Control
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search in shop ..."
            />
            <Button onClick={submitHandler} variant="warning">
              <i className="bi bi-search text-dark"></i>
            </Button>
            <Button onClick={toggleTheme} variant="danger">
              <i
                className={
                  mode === "dark"
                    ? "bi-sun-fill text-dark"
                    : "bi-moon-fill text-dark"
                }
              ></i>
            </Button>
          </InputGroup>
        </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
