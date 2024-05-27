import { ListGroup, Button } from "react-bootstrap";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";

import { useSelector } from "react-redux";
import { ReduxAppState } from "types";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProductListPageFilterComponentProps {

}

const ProductListPageFilterComponent = ({

}: ProductListPageFilterComponentProps) => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();

  // get query parameters from page URL
  const queryParamSearchQuery = query.get("search") || "";
  const queryParamCategoryName = query.get("category") || "All";
  const queryParamRating = query.get("rating") || "";
  const queryParamSortOption = query.get("sort") || "";
  const queryParamPriceOption = query.get("price") || "";
  const parsedRating = parseInt(queryParamRating);

  const showFiltersResetButton =
    queryParamSearchQuery !== "" ||
    queryParamCategoryName !== "All" ||
    queryParamRating !== "" ||
    queryParamSortOption !== "" ||
    queryParamPriceOption !== "";

  const [showResetFiltersButton, setShowResetFiltersButton] = useState(
    showFiltersResetButton
  );
  const [priceFilter, setPriceFilter] = useState<number>(
    queryParamPriceOption === "" ? 2000 : parseInt(queryParamPriceOption)
  );
  const [categoryFromFilter, setCategoryFromFilter] = useState<string>(
    queryParamCategoryName
  );
  const [sortOption, setSortOption] = useState(queryParamSortOption);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(
    parsedRating
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowResetFiltersButton(showFiltersResetButton);
    setCategoryFromFilter(queryParamCategoryName);
    setSortOption(queryParamSortOption);
    setPriceFilter(
      queryParamPriceOption === "" ? 2000 : parseInt(queryParamPriceOption)
    );
    setRatingFilter(parsedRating);
  }, [
    queryParamCategoryName,
    queryParamSortOption,
    queryParamPriceOption,
    parsedRating,
    location,
    showFiltersResetButton,
  ]);

  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);

  const handleFilters = () => {
    setShowResetFiltersButton(true);

    // setting filters changes the page with navigate so that new query params can be added/removed
    let queryParams: string[] = [];
    if (categoryFromFilter !== "All" && categoryFromFilter)
      queryParams.push(`category=${categoryFromFilter}`);
    if (queryParamSearchQuery)
      queryParams.push(`search=${queryParamSearchQuery}`);
    if (sortOption) queryParams.push(`sort=${sortOption}`);
    if (ratingFilter) queryParams.push(`rating=${ratingFilter}`);
    if (priceFilter) queryParams.push(`price=${priceFilter}`);
    if (priceFilter) queryParams.push(`pageNum=1`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    console.log(`Query String in filter component is: ${queryString}`)

    navigate(`/product-list${queryString}`);
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    navigate(`/product-list?pageNum=1`);
  };

  const listItemStyle = {
    backgroundColor: mode === "dark" ? "rgb(45, 45, 45)" : "rgb(255, 255, 255)",
    color: mode === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  };

  return (
    <>
      <ListGroup variant="flush" className="mt-4">
        <ListGroup.Item className="" style={listItemStyle}>
          <SortOptionsComponent setSortOption={setSortOption} />
        </ListGroup.Item>
        <ListGroup.Item style={listItemStyle}>
          <PriceFilterComponent price={priceFilter} setPrice={setPriceFilter} />
        </ListGroup.Item>
        <ListGroup.Item style={listItemStyle}>
          <RatingFilterComponent
            setRating={setRatingFilter}
            rating={ratingFilter}
          />
        </ListGroup.Item>
        <ListGroup.Item style={listItemStyle}>
          <CategoryFilterComponent
            queryParamCategoryName={queryParamCategoryName}
            categoryFromFilter={categoryFromFilter}
            setCategoryFromFilter={setCategoryFromFilter}
          />
        </ListGroup.Item>
        <ListGroup.Item style={listItemStyle}>
          <Button type="button" variant="primary" onClick={handleFilters}>
            Filter
          </Button>{" "}
          {showResetFiltersButton && (
            <Button type="button" onClick={resetFilters} variant="danger">
              Reset filters
            </Button>
          )}
        </ListGroup.Item>
      </ListGroup>
    </>
  );
};

export default ProductListPageFilterComponent;
