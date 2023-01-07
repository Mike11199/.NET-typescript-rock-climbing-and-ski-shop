import ProductListPageComponent from "./components/ProductListPageComponent";
import axios from "axios";

import { useSelector } from "react-redux";

let filtersUrl = "";

const getProducts = async (categoryName = "", pageNumParam = null, searchQuery = "", filters = {}, sortOption = "") => {
    //   filtersUrl = "&price=60&rating=1,2,3&category=a,b,c,d&attrs=color-red-blue,size-1TB-2TB";
    filtersUrl = "";
    console.log(filters);
    const search = searchQuery ? `search/${searchQuery}/` : "";
    const category = categoryName ? `category/${categoryName}/` : "";
    const url = `/api/products/${category}${search}?pageNum=${pageNumParam}${filtersUrl}&sort=${sortOption}`;
    const { data } = await axios.get(url);
    return data
}

const ProductListPage = () => {

    const { categories } = useSelector((state) => state.getCategories);

  return <ProductListPageComponent getProducts={getProducts} categories={categories} />;
};

export default ProductListPage;

