import HomePageComponent from "./components/HomePageComponent";
import { useSelector } from "react-redux";
import axios from "axios";

// API call functions (e.g- getBestselllers) are kept outside of components to make components testable.
// for example, we can easily replace getBestsellers API with test data instead of live data.
// error handling such as try/catch or promises (then/catch) are in the HomePageComponent not API functions here.

const getBestsellers = async () => {
  try {
    const { data } = await axios.get("/api/products/bestsellers");
    return data;
  } catch (error) {
    console.log(error)
  }
};

const HomePage = () => {
  const { categories } = useSelector((state: any) => state.getCategories);

  return (
    <HomePageComponent
      categories={categories}
      getBestsellers={getBestsellers}
    />
  );
};

export default HomePage;
