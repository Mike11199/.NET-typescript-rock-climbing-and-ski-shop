import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";
import apiURL from "../utils/ToggleAPI";
import { GetProductsResponse } from "types";
import { GetProducts } from "types";

export const getProducts = async ({
  pageNumParam,
  searchQuery,
  categoryName,
  sortOption,
  priceFilter,
  ratingFilter,
}: GetProducts): Promise<GetProductsResponse> => {
  // assemble request to get products
  let queryParams: string[] = [];
  if (categoryName && categoryName !== "All")
    queryParams.push(`category=${categoryName}`);
  if (searchQuery) queryParams.push(`search=${searchQuery}`);
  if (pageNumParam) queryParams.push(`pageNum=${pageNumParam}`);
  if (sortOption) queryParams.push(`sort=${sortOption}`);
  if (priceFilter) queryParams.push(`price=${priceFilter}`);
  if (ratingFilter) queryParams.push(`rating=${ratingFilter}`);

  // final request
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  const requestUrl = `${apiURL}/products${queryString}`;
  const { data } = await axios.get(requestUrl);
  return data;
};

const ProductListPage = () => {
  return <ProductListPageComponent getProducts={getProducts} />;
};

export default ProductListPage;
