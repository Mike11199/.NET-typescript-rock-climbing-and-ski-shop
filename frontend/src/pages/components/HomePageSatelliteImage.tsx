import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import NASALandSatImage from "../../images/landsat.png";
import NASALogoImage from "../../images/nasa.png";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const HomePageSatelliteImage = () => {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  const externalRequestAxios = axios.create();
  const [startDate, setStartDate] = useState(currentDate);

  useEffect(() => {
    getSnowCoverData();
  }, [startDate]);

  // https://nasa-gibs.github.io/gibs-api-docs/access-basics/#map-projections
  // https://nasa-gibs.github.io/gibs-api-docs/access-basics/#service-endpoints
  const getSnowCoverData = async () => {
    const url2 =
      "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/";
    const format = ".jpg";
    const level = 4;
    const row = 2;
    const col = 3;

    //console.log(startDate);
    const formattedSTARTDate = startDate.toISOString().split("T")[0];
    //console.log(formattedSTARTDate);
    const requestUrl = `${url2}${formattedSTARTDate}/250m/${level}/${row}/${col}.jpg`;
    //console.log(requestUrl);

    try {
      const response = await externalRequestAxios.get(requestUrl, {
        responseType: "arraybuffer",
      });
      const imageBlob = new Blob([response.data], { type: format });
      const imageUrl = URL.createObjectURL(imageBlob);

      // Create an image element and set its source to the generated URL
      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("nasa_sat_image"); // Replace 'your-class-name' with your desired class name

      // Append the image element to a container on your website
      const container = document.getElementById("nasa_image_container");

      // Check if the container already contains an image
      const existingImage = container?.querySelector("img");
      if (existingImage) {
        // If an image element already exists in the container, remove it
        container?.removeChild(existingImage);
      }

      // Append the image element to the container
      container?.appendChild(img);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Container>
        {/* https://nasa-gibs.github.io/gibs-api-docs/access-basics/#map-projections */}
        <h3 className="snow_section_title">Snow Cover Satellite Image</h3>
        <div className="nasa_snow_cover">
          <div className="sat_images">
            <img
              className="nasa_logo"
              alt="nasa_logo"
              src={NASALogoImage}
            ></img>
            <img
              className="land_sat"
              alt="land_sat"
              src={NASALandSatImage}
            ></img>
          </div>
          <div id="nasa_image_container"></div>
          <div className="date_and_text_nasa">
            <DayPicker
              mode="single"
              selected={startDate}
              onSelect={setStartDate as any}
            />
            <div className="sat_text">
              <ul>
                <li>
                  See latest image for snow cover from the MODIS (Moderate
                  Resolution Imaging SpectroRadiometer) sensor - on the NASA
                  Terra (EOS AM-1) satellite.
                </li>
                <li style={{ marginTop: "20px" }}>
                  Terra was launched in 1999 and orbits in a sun-synchronous
                  orbit, meaning it passes over any given point on the earth at
                  the same local solar time. This gives consistent lighting for
                  land imagery. The satellite also boasts a 250m spatial
                  resolution, meaning that one pixel represents an area of 250 x
                  250 meters on the ground. This is about 14 suburban sized
                  houses wide.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default HomePageSatelliteImage;
