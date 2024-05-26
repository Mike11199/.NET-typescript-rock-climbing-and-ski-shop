import { Navbar } from "react-bootstrap";
import React, { useState, useCallback } from "react";
import { LinkContainer } from "react-router-bootstrap";

import HeaderNavLinks from "./HeaderNavLinks";
import HeaderSearchContainer from "./HeaderSearchContainer";
import { useDispatch } from "react-redux";
import { updateSearchString } from "../../redux/actions/searchActions";

const HeaderComponent = () => {
  const [searchCategoryToggle, setSearchCategoryToggle] =
    useState<string>("All");

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


const MainTitleContainer = React.memo(({
  handleClickingTitle,
}: {
  handleClickingTitle: () => void;
}) => {
  return (
    <button className="transparent-button">
      <LinkContainer to="/">
        <Navbar.Brand onClick={handleClickingTitle} href="/">
          🏔 Alpine Peak Climbing and Ski Gear
        </Navbar.Brand>
      </LinkContainer>
    </button>
  );
});
