import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";

import { useSelector } from "react-redux";
import apiURL from "../utils/ToggleAPI";
import { ReduxAppState, GetProductsResponse } from "types";
import { GetProducts } from "types";

const parseFiltersToQueryURLString = (filters) => {
  let filtersUrl = "";

  Object.keys(filters).forEach((key) => {
    if (key === "price") {
      filtersUrl += `price=${filters[key]}`;
    } else if (key === "rating") {
      filtersUrl += `&rating=${filters[key]}`;
    }
  });
  return filtersUrl;
};

export const getProducts = async ({
  categoryName,
  pageNumParam,
  searchQuery,
  filters,
  sortOption,
}: GetProducts): Promise<GetProductsResponse> => {

  let queryParams: string[] = [];
  if (categoryName) queryParams.push(`category=${categoryName}`);
  if (searchQuery) queryParams.push(`search=${searchQuery}`);
  if (pageNumParam) queryParams.push(`pageNum=${pageNumParam}`);
  if (sortOption) queryParams.push(`sort=${sortOption}`);
  const filterOptions = parseFiltersToQueryURLString(filters);
  if (filterOptions) queryParams.push(`${filterOptions}`);

  // final request
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const requestUrl = `${apiURL}/products${queryString}`;
  const { data } = await axios.get(requestUrl);
  return data;
};

const ProductListPage = () => {
  const { categories } = useSelector(
    (state: ReduxAppState) => state.getCategories
  );

  return (
    <ProductListPageComponent
      getProducts={getProducts}
      categories={categories}
    />
  );
};

export default ProductListPage;
