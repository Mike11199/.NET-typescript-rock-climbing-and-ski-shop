import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";

import { useSelector } from "react-redux";
import { Product, ReduxAppState } from "types";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProductListPageFilterComponentProps {
  products: Product[] | null | undefined;
  totalProductsCount: number;
  loading: boolean;
  error: boolean;
}

const ProductListPageFilterComponent = ({
  products,
  totalProductsCount,
  loading,
  error,
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

    navigate(`/product-list${queryString}`);
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    navigate(`/product-list?pageNum=1`);
  };

  return (
    <div className="filters-container">
      <ResultsCountContainer
        productCountVisible={products?.length}
        productCount={totalProductsCount}
        loading={loading}
        error={error}
      />
      <SortOptionsComponent setSortOption={setSortOption} />
      <PriceFilterComponent price={priceFilter} setPrice={setPriceFilter} />
      <RatingFilterComponent
        setRating={setRatingFilter}
        rating={ratingFilter}
      />
      <CategoryFilterComponent
        queryParamCategoryName={queryParamCategoryName}
        categoryFromFilter={categoryFromFilter}
        setCategoryFromFilter={setCategoryFromFilter}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        <button
          type="button"
          className="primary-button-blue"
          onClick={handleFilters}
          style={{ width: "100%" }}
        >
          Filter / Sort
        </button>{" "}
        {showFiltersResetButton && (
          <button
            type="button"
            className="secondary-button-red"
            onClick={resetFilters}
            style={{ width: "100%" }}
          >
            Reset All
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductListPageFilterComponent;

const ResultsCountContainer = ({
  productCount,
}: {
  productCount?: number;
  productCountVisible?: number;
  loading: boolean;
  error: boolean;
}) => {
  return (
    <div className="results-count-container">
      <div>
        <h6>
          {productCount} {productCount === 1 ? "Result" : "Results"}
        </h6>
      </div>
    </div>
  );
};
