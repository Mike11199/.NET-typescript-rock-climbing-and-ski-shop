import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Row, Container } from "react-bootstrap";
import PlantSmallTreeImage from "../../images/plant_tree.jpg";
import { useEffect, useState } from "react";
import CountUpComponent from "./CountUpComponent";
import HomePageSkiBanner from "./HomePageSkiBanner";
import HomePageSatelliteImage from "./HomePageSatelliteImage";

import { BestsellerItem, Category } from "types";
import {
  testDotnetAPIStatus,
  testDotnetAPIProtectedRoute,
  testDotnetAPIProductController,
} from "./HomePageTests";
import { Spinner } from "react-bootstrap";

const HomePageComponent = ({ categories, getBestsellers }) => {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [bestSellers, setBestsellers] = useState<BestsellerItem[]>([]); // Use [] to initialize an empty array
  const [error, setError] = useState<any>("");

  testDotnetAPIStatus();
  testDotnetAPIProductController();
  // testDotnetAPIProtectedRoute();

  useEffect(() => {
    getBestsellers()
      .then((data: BestsellerItem[]) => {
        if (data) {
          setBestsellers(data);
        }
      })
      .catch((er) => {
        const errMessage =
          er?.response?.data?.message ?? er?.response?.data ?? "";
        setError(errMessage);
        console.log(errMessage);
      });

    if (Array.isArray(categories)) {
      setMainCategories((cat) =>
        categories.filter((item) => !item.name.includes("/"))
      );
    }
  }, [categories, getBestsellers]);

  const EnvironmentPledgeContainer = () => (
    <Container>
      <div className="climate_pledge_div">
        <img
          className="plant_tree"
          alt="skier_vector"
          src={PlantSmallTreeImage}
        />
        <div className="climate_text_div">
          <p className="climate_text_paragraph">
            <span style={{ fontWeight: "bold" }}>Giving Back: &nbsp;</span>
            Actions speak louder than words. To offset our carbon footprint and
            protect the environment, we pledge to plant one tree for every
            dollar our store sells. The average tree offsets 48 pounds of CO2 a
            year.
          </p>
          <div>
            <CountUpComponent />
          </div>
        </div>
      </div>
    </Container>
  );

  const ProductCategoryCardsContainer = () => (
    <Container>
      <Row xs={1} md={2} className="g-4 mt-4">
        {mainCategories.map((category, idx) => (
          <>
            <div
              key={`category_div_container_${category?.categoryId}`}
              className="cardComponentGrid"
            >
              <CategoryCardComponent
                key={`cardComponentGrid_${category?.categoryId}`}
                category={category}
                idx={idx}
              />
            </div>
          </>
        ))}
      </Row>
      {error}
    </Container>
  );

  const ProductCategoryCardsLoadingSpinner = () => (
    <Container>
      {mainCategories?.length === 0 && (
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "4rem",
          }}
        >
          <Spinner
            as="span"
            animation="border"
            variant="primary"
            role="status"
            aria-hidden="true"
          />
        </div>
      )}
    </Container>
  );

  return (
    <>
      <HomePageSkiBanner />
      <ProductCarouselComponent bestSellers={bestSellers} />
      <ProductCategoryCardsLoadingSpinner />
      <ProductCategoryCardsContainer />
      <EnvironmentPledgeContainer />
      <HomePageSatelliteImage />
    </>
  );
};

export default HomePageComponent;
