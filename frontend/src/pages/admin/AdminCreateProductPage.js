import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";

const createProductApiRequest = async (formInputs) => {
    const { data } = await axios.post(`/api/products/admin`, { ...formInputs });
    return data;
}

const uploadImagesApiRequest = async (images, productId) => {
    const formData = new FormData();
    Array.from(images).forEach(image => {
        formData.append("images", image);
    })
    await axios.post("/api/products/admin/upload?productId=" + productId, formData);
}

const AdminCreateProductPage = () => {
  
  return <CreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} />;
};

export default AdminCreateProductPage;

