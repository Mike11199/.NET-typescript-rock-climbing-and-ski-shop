import ProductCarouselComponent from "../../components/ProductCarouselComponent";
import CategoryCardComponent from "../../components/CategoryCardComponent";
import { Row, Container, Col } from "react-bootstrap";
import Skier_Vector from "../../images/skier_vector.png"
import Slope_Background from "../../images/ski_slope_6.png"
import Snowfall from 'react-snowfall'
import CloudVector from "../../images/cloud_vector3.png"
import Tree from "../../images/tree.png"
import Ski_Chair from "../../images/ski_chair.png"
import Plant_Tree from "../../images/plant_tree.jpg"
import { useEffect, useState } from "react";
import CountUpComponent from './CountUpComponent';


const HomePageComponent = ({ categories, getBestsellers }) => {
  
    const [mainCategories, setMainCategories] = useState([]);
    const [bestSellers, setBestsellers] = useState([]);
    const [error, setError] = useState('');





    useEffect(() => {
       
      getBestsellers()
        .then((data) => {
            setBestsellers(data);
        })
        .catch((er) => {
          setError(er.response.data.message ? er.response.data.message : er.response.data)
          console.log(er.response.data.message ? er.response.data.message : er.response.data)
        });
              
        setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")));  // will always run

    }, [categories, getBestsellers])



  return (
    <>
      <div className="banner_box_container">
        <div className="ski_banner_box">
          <Snowfall />
          {/* <div className="ski_slope"></div> */}
          <img className="skier_banner_slope" alt="skier_slope" src={Slope_Background} />
          <img className="tree" alt="tree" src={Tree} />
          <img className="ski_chair" alt="ski_chair" src={Ski_Chair} />
          <img className="ski_chair2" alt="ski_chair2" src={Ski_Chair} />
          <img className="ski_chair3" alt="ski_chair2" src={Ski_Chair} />
          <img className="ski_chair4" alt="ski_chair2" src={Ski_Chair} />
          <img className="ski_chair5" alt="ski_chair2" src={Ski_Chair} />
          <img className="cloud_banner_vector" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector2" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector3" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector4" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector5" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector6" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector7" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector8" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector9" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector10" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector11" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector12" alt="cloud_vector" src={CloudVector} />
          <img className="cloud_banner_vector13" alt="cloud_vector" src={CloudVector} />
          <img className="skier_banner_vector" alt="skier_vector" src={Skier_Vector} />        
        </div>
      </div>


      <ProductCarouselComponent bestSellers={bestSellers} />
      <Container>        
      <Row xs={1} md={2} className="g-4 mt-4">
          {mainCategories.map((category, idx) => (          
          <>            
          <div className="cardComponentGrid">
          <CategoryCardComponent key={idx} category={category} idx={idx} className="test"/>             
          </div>
          </>
          ))}
        </Row>
        {error}
      </Container>
      <Container>        
        <div className="climate_pledge_div">
          <img className="plant_tree" alt="skier_vector" src={Plant_Tree} />    
          <div className="climate_text_div">
              <p className="climate_text_paragraph">
                <span style={{fontWeight:"bold"}}>Giving Back: &nbsp;</span> 
                 Actions speak louder than words.  To offset our carbon footprint and protect the environment, we pledge to plant one tree for every dollar our store sells.
              </p>     
            <CountUpComponent />            
          </div>     
        </div>    
      </Container>
    </>
  );
};

export default HomePageComponent;

