import axios from "axios";

export const uploadImagesApiRequest = async (images, productId) => {
  const formData = new FormData();
  Array.from(images).forEach((image) => {
    formData.append("images", image);
  });
  const { data } = await axios.post("/api/products/admin/upload?productId=" + productId, formData);
  return data;
};

export const uploadImagesCloudinaryApiRequest = (images,productId) => {

    //https://cloudinary.com/documentation/upload_images#code_explorer_upload_multiple_files_using_a_form_unsigned

    const url = "https://api.cloudinary.com/v1_1/dwgvi9vwb/image/upload"  //dwgvi9vwb is env cloud name from cloudinary settings
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
        let file = images[i];
        formData.append("file", file);
        formData.append("upload_preset", "gdsFDSW32") //upload preset from cloudinary settings
        fetch(url, {
            method: "POST",
            body: formData,
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            axios.post("/api/products/admin/upload?cloudinary=true&productId=" + productId, data);
        })
    }
}
