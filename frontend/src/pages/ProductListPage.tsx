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
      const rat = Object.keys(filters[key])
        .filter((subKey) => filters[key][subKey])
        .join(",");
      if (rat) filtersUrl += `&rating=${rat}`;
    } else if (key === "category") {
      const cat = Object.keys(filters[key])
        .filter((subKey) => filters[key][subKey])
        .join(",");
      if (cat) filtersUrl += `&category=${cat}`;
    } else if (key === "attrs" && filters[key].length > 0) {
      const attrs = filters[key]
        .reduce((acc, item) => {
          const values = item.values.join("-");
          return `${acc}${item.key}-${values},`;
        }, "")
        .slice(0, -1); // Remove the last comma
      filtersUrl += `&attrs=${attrs}`;
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
  // path segments - affect which controller is called
  const category = categoryName ? `/category/${categoryName}/` : "";
  // query parameters
  let queryParams: string[] = [];
  if (searchQuery) queryParams.push(`search=${searchQuery}`);
  if (pageNumParam) queryParams.push(`pageNum=${pageNumParam}`);
  if (sortOption) queryParams.push(`sort=${sortOption}`);
  const filterOptions = parseFiltersToQueryURLString(filters);
  if (filterOptions) queryParams.push(`${filterOptions}`);

  // final request
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const requestUrl = `${apiURL}/products${category}${queryString}`;
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
