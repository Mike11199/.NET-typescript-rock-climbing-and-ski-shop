import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Row, Container } from "react-bootstrap";

import { useEffect, useState } from "react";

const HomePageComponent = ({ categories, getBestsellers }) => {
  
    const [mainCategories, setMainCategories] = useState([]);
    const [bestSellers, setBestsellers] = useState([]);

    useEffect(() => {
        getBestsellers()
        .then((data) => {
            setBestsellers(data);
        })
        .catch((er) => console.log(er.response.data.message ? er.response.data.message : er.response.data));
        setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));
    }, [categories])

  return (
    <>
      <ProductCarouselComponent bestSellers={bestSellers} />
      <Container>
        <Row xs={1} md={2} className="g-4 mt-5">
          {mainCategories.map((category, idx) => (
            <CategoryCardComponent key={idx} category={category} idx={idx} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default HomePageComponent;

