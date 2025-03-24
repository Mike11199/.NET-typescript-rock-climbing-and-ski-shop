import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Container } from "react-bootstrap";
import { LatLngExpression } from "leaflet";
import NASALogoImage from "../../images/nasa.png";
import NASALandSatImage from "../../images/landsat.png";

const SnowMap = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [sliderValue, setSliderValue] = useState(15);
  const [formattedDate, setFormattedDate] = useState("");
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([54, -30]);

  const baseMonthDate = startOfMonth(new Date(today.getFullYear(), month));
  const lastDayOfMonth = endOfMonth(baseMonthDate).getDate();
  const selectedDate = addDays(baseMonthDate, sliderValue);

  useEffect(() => {
    setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  const baseLayer = formattedDate
    ? `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${formattedDate}/250m/{z}/{y}/{x}.jpg`
    : "";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    setSliderValue(0);
  };

  return (
    <Container>
      <div className="nasa_snow_cover_container">
        <div>
          <div className="nasa_snow_cover_header">
            <h2> Snow Tracker - NASA MODIS</h2>
            <div>
              <img className="nasa_logo" alt="nasa_logo" src={NASALogoImage} />
              <img className="land_sat" alt="land_sat" src={NASALandSatImage} />
            </div>
          </div>
          <hr />
        </div>
        <div className="date_and_text_nasa">
          <div className="sat_text">
            <ul>
              <li>
                See the latest image for snow cover from the MODIS (Moderate
                Resolution Imaging Spectroradiometer) sensor, on the NASA Terra
                (EOS AM-1) satellite, which captures data in the visible light
                spectrum as well as other wavelengths such as infared.
              </li>
              <li style={{ marginTop: "20px" }}>
                Terra was launched in 1999 and orbits in a sun-synchronous
                orbit, meaning it passes over any given point on the earth at
                the same local solar time. At 250m spatial resolution, each
                pixel represents an area of 250 x 250 meters on the ground - or
                about 14 suburban sized houses wide.
              </li>
            </ul>
          </div>
        </div>
        <div className="label_container">
          <label>
            <select
              value={month}
              onChange={handleMonthChange}
              style={{
                padding: "0.3rem",
                backgroundColor: "#222",
                color: "#fff",
                border: "1px solid #555",
              }}
            >
              {[...Array(12).keys()].map((m) => (
                <option key={m} value={m}>
                  {format(new Date(2023, m), "MMMM")}
                </option>
              ))}
            </select>
          </label>
          {formattedDate}
        </div>

        <input
          type="range"
          min={0}
          max={lastDayOfMonth}
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            width: "100%",
            marginBottom: "1rem",
            WebkitAppearance: "none",
            height: "6px",
            borderRadius: "5px",
            background: "#444",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{format(baseMonthDate, "MMM d")}</span>
          <span>{format(addDays(baseMonthDate, lastDayOfMonth), "MMM d")}</span>
        </div>

        <div className="sat_map_container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={2}
          maxZoom={8}
          scrollWheelZoom
          style={{ height: "600px", width: "100%" }}
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          preferCanvas={true}
          fadeAnimation={false}
          whenCreated={(map) => {
            map.on("moveend", () =>
              setMapCenter([map.getCenter().lat, map.getCenter().lng])
            );
            map.on("zoomend", () => setMapZoom(map.getZoom()));
          }}
        >
          <TileLayer
            key={formattedDate}
            url={baseLayer}
            attribution="NASA GIBS - MODIS True Color"
            tileSize={512}
            opacity={1}
            zIndex={1}
            noWrap
            updateWhenZooming={false}
            updateWhenIdle={true}
          />
        </MapContainer>
        </div>
      </div>
    </Container>
  );
};

export default SnowMap;
