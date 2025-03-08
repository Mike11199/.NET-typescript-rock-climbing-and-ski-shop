import axios from "axios";

export const testDotnetAPIProtectedRoute = async () => {
  try {
    const { data } = await axios.get("/apiv2/APIStatus/protected");
    console.log("testing the protected route!!");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const testDotnetAPIStatus = async () => {
  try {
    const { data } = await axios.get("/apiv2/APIStatus");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const testDotnetAPIProductController = async () => {
  try {
    const { data } = await axios.get("/apiv2/products");
    console.log(
      "Test retrieving a product from api v2 .NET app docker container - RDS PostgreSQL database. ",
    );
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
