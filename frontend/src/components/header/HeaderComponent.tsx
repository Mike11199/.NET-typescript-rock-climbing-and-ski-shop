import { Navbar } from "react-bootstrap";
import React, { useState, useCallback, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

import HeaderNavLinks from "./HeaderNavLinks";
import HeaderSearchContainer from "./HeaderSearchContainer";
import { useDispatch } from "react-redux";
import { updateSearchString } from "../../redux/actions/searchActions";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SkiShopLogo from "../../images/new_ski_shop_logo.png";

const HeaderComponent = () => {
  const [searchCategoryToggle, setSearchCategoryToggle] =
    useState<string>("All");

  const location = useLocation();

  useEffect(() => {
    toast.dismiss();
  }, [location]);

  const dispatch = useDispatch();

  const updateSearchQuery = useCallback(
    (search: string) => {
      dispatch(updateSearchString(search));
    },
    [dispatch]
  );

  const handleClickingTitle = useCallback(() => {
    setSearchCategoryToggle("All");
    updateSearchQuery("");

    setTimeout(() => {
      const navItems = document.querySelectorAll(".nav-link");
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
    }, 0);
  }, [updateSearchQuery]);

  return (
    <Navbar
      collapseOnSelect
      expand={false}
      variant="dark"
      className="navbar-black"
    >
      <div className="navbar-items-container">
        <MainTitleContainer handleClickingTitle={handleClickingTitle} />
        <HeaderSearchContainer
          searchCategoryToggle={searchCategoryToggle}
          setSearchCategoryToggle={setSearchCategoryToggle}
        />
        <HeaderNavLinks />
      </div>
    </Navbar>
  );
};

export default HeaderComponent;

const MainTitleContainer = React.memo(
  ({ handleClickingTitle }: { handleClickingTitle: () => void }) => {
    return (
      <LinkContainer to="/">
        <Navbar.Brand onClick={handleClickingTitle} className="scalable-brand">
          <div className="header_logo_container">
            <img src={SkiShopLogo} className="site_logo_image" />
            <span className="site-header-text">
              Alpine Peak Climbing and Ski Gear
            </span>
          </div>
        </Navbar.Brand>
      </LinkContainer>
    );
  }
);
