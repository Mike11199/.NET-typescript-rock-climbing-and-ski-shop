import {
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import React, { useRef, useEffect } from "react";


import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/actions/categoryActions";
import { setDarkMode } from "../../redux/actions/darkModeActions";
import { updateSearchString } from "../../redux/actions/searchActions";
import "../../darkMode.css";
import { ReduxAppState } from "types";

interface HeaderSearchContainerProps {
  searchCategoryToggle: string;
  setSearchCategoryToggle: any;
}

const HeaderSearchContainer = ({
  searchCategoryToggle,
  setSearchCategoryToggle,
}: HeaderSearchContainerProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchInputGroupRef = useRef<HTMLFormElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const toggleThemeRef = useRef<HTMLButtonElement>(null);
  const dropdownButtonRef = useRef<HTMLDivElement>(null);

  const { categories } = useSelector(
    (state: ReduxAppState) => state.getCategories
  );
  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);
  const { searchString } = useSelector(
    (state: ReduxAppState) => state.searchString
  );

  const updateSearchReduxState = (search: string) =>
    dispatch(updateSearchString(search));

  const extractCategoryName = (pathname) => {
    const match = pathname.match(/\/product-list\/category\/([^/]+)/);
    return match ? match[1] : null;
  };

  const location = useLocation();
  const categoryName = extractCategoryName(location.pathname);

  useEffect(() => {
    if (categoryName != undefined) setSearchCategoryToggle(categoryName);
  }, [categoryName]);

  const toggleTheme = () => {
    toggleThemeRef?.current?.blur();
    if (mode === "light") {
      dispatch(setDarkMode("dark"));
    } else {
      dispatch(setDarkMode("light"));
    }
  };

  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const searchButtonSubmitHandler = (e: any) => {
    e.preventDefault();

    searchInputRef?.current?.blur();
    searchInputGroupRef?.current?.blur();
    searchButtonRef?.current?.blur();

    if (searchString?.trim()) {
      if (searchCategoryToggle === "All") {
        navigate(`/product-list/search/${searchString}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle?.replaceAll(
            "/",
            ","
          )}/search/${searchString}`
        );
      }
    } else if (searchCategoryToggle !== "All") {
      navigate(
        `/product-list/category/${searchCategoryToggle?.replaceAll("/", ",")}`
      );
    } else {
      navigate("/product-list");
    }
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
    <Form onSubmit={searchButtonSubmitHandler} className="search-input-group" ref={searchInputGroupRef}>
      <InputGroup style={{ flexWrap: "nowrap" }}>
        <DropdownButton id="dropdown-basic-button" title={CategoryButtonText()} ref={dropdownButtonRef}>
          <Dropdown.Item onClick={() => {setSearchCategoryToggle("All"); dropdownButtonRef?.current?.blur()}}>
            All
          </Dropdown.Item>
          {categories.map((category, id) => (
            <Dropdown.Item
              key={id}
              onClick={() => {setSearchCategoryToggle(category?.name); dropdownButtonRef?.current?.blur()}}
            >
              {category.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          id="header-search-input"
          ref={searchInputRef}
          onChange={(e) => updateSearchReduxState(e.target.value)}
          type="text"
          placeholder="Search in shop ..."
          autoComplete="off"
          value={searchString}
        />
        <Button onClick={searchButtonSubmitHandler} variant="warning" ref={searchButtonRef}>
          <i className="bi bi-search text-dark"></i>
        </Button>
        <Button onClick={toggleTheme} variant="danger" ref={toggleThemeRef}>
          <i
            className={
              mode === "dark"
                ? "bi-sun-fill text-dark"
                : "bi-moon-fill text-dark"
            }
          ></i>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default HeaderSearchContainer;
