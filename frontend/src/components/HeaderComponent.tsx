import { Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";

import React, { useState } from "react";

import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import socketIOClient from "socket.io-client";
import {
  setChatRooms,
  setSocket,
  setMessageReceived,
  removeChatRoom,
} from "../redux/actions/chatActions";

import "../darkMode.css";
import { ReduxAppState } from "types";
import HeaderSearchContainer from "./HeaderSearchContainer";

const HeaderComponent = () => {
  const dispatch = useDispatch();
  const [searchCategoryToggle, setSearchCategoryToggle] =
    useState<string>("All");

  const { userInfo } = useSelector(
    (state: ReduxAppState) => state.userRegisterLogin
  );
  const itemsCount = useSelector(
    (state: ReduxAppState) => state.cart.itemsCount
  );

  const { messageReceived } = useSelector(
    (state: ReduxAppState) => state.adminChat
  );

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

  const MainTitleContainer = () => {
    return (
      <button className="transparent-button">
        <LinkContainer to="/">
          <Navbar.Brand onClick={() => setSearchCategoryToggle("All")} href="/">
            🏔 Alpine Peak Climbing and Ski Gear
          </Navbar.Brand>
        </LinkContainer>
      </button>
    );
  };

  const NavLinks = () => {
    return (
      <Nav>
        <div className="nav-links-container">
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

  return (
    <Navbar
      collapseOnSelect
      expand={false}
      variant="dark"
      className="navbar-black"
    >
      <div className="navbar-items-container">
        <MainTitleContainer />
        <HeaderSearchContainer
          searchCategoryToggle={searchCategoryToggle}
          setSearchCategoryToggle={setSearchCategoryToggle}
        />
        <NavLinks />
      </div>
    </Navbar>
  );
};

export default HeaderComponent;
