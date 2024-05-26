import { Navbar } from "react-bootstrap";
import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";

import HeaderNavLinks from "./HeaderNavLinks";
import HeaderSearchContainer from "./HeaderSearchContainer";
import { useDispatch } from "react-redux";
import { updateSearchString } from "../../redux/actions/searchActions";

const HeaderComponent = () => {
  const [searchCategoryToggle, setSearchCategoryToggle] =
    useState<string>("All");

  const dispatch = useDispatch();
  const updateSearchQuery = (search: string) => dispatch(updateSearchString(search));

  const handleClickingTitle = () => {
    setSearchCategoryToggle("All")
    updateSearchQuery("")
  }


  const MainTitleContainer = () => {
    return (
      <button className="transparent-button">
        <LinkContainer to="/">
          <Navbar.Brand onClick={() => handleClickingTitle()} href="/">
            🏔 Alpine Peak Climbing and Ski Gear
          </Navbar.Brand>
        </LinkContainer>
      </button>
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
        <HeaderNavLinks />
      </div>
    </Navbar>
  );
};

export default HeaderComponent;
