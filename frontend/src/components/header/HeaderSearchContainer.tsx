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
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchInputRef?.current) {
      searchInputRef?.current?.blur();
    }
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
    <Form onSubmit={searchButtonSubmitHandler} className="search-input-group">
      <InputGroup style={{ flexWrap: "nowrap" }}>
        <DropdownButton id="dropdown-basic-button" title={CategoryButtonText()}>
          <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
            All
          </Dropdown.Item>
          {categories.map((category, id) => (
            <Dropdown.Item
              key={id}
              onClick={() => setSearchCategoryToggle(category?.name)}
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
        <Button onClick={searchButtonSubmitHandler} variant="warning">
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
    </Form>
  );
};

export default HeaderSearchContainer;
