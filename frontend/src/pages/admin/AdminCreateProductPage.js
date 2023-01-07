import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";
import { uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";

const createProductApiRequest = async (formInputs) => {
    const { data } = await axios.post(`/api/products/admin`, { ...formInputs });
    return data;
}


const AdminCreateProductPage = () => {
  
  return <CreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} />;
};

export default AdminCreateProductPage;

