import EditProductPageComponent from "./components/EditProductPageComponent";

import { useSelector } from "react-redux";
import axios from 'axios'

const fetchProduct = async (productId) => {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    return data;
}

const AdminEditProductPage = () => {

  const { categories } = useSelector((state) => state.getCategories);

  return <EditProductPageComponent categories={categories} fetchProduct={fetchProduct} />;
};

export default AdminEditProductPage;

