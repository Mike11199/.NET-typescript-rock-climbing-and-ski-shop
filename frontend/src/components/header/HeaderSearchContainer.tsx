import {
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCategories } from "../../redux/actions/categoryActions";
import { setDarkMode } from "../../redux/actions/darkModeActions";
import "../../darkMode.css"
import { ReduxAppState } from "types";

interface HeaderSearchContainerProps {
  searchCategoryToggle: string;
  setSearchCategoryToggle: any;
}

const HeaderSearchContainer = ({
  searchCategoryToggle,
  setSearchCategoryToggle,
}: HeaderSearchContainerProps) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(
    (state: ReduxAppState) => state.getCategories
  );

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);

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
    if (e.keyCode == 13) {
      console.log("pressed enter!");
    }
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
      <InputGroup style={{flexWrap: "nowrap"}}>
        <DropdownButton id="dropdown-basic-button" title={CategoryButtonText()}>
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
          id="header-search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search in shop ..."
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
