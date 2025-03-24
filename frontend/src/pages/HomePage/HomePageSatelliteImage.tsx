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
import Select from "react-select";

const SnowMap = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [sliderValue, setSliderValue] = useState(15);
  const [formattedDate, setFormattedDate] = useState("");
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([54, -30]);

  const [selectedLayer, setSelectedLayer] = useState(
    "MODIS_Terra_CorrectedReflectance_Bands367"
  );

  const modisLayers = [
    {
      label: "Natural Color (True Color - Bands 1,4,3)",
      value: "MODIS_Terra_CorrectedReflectance_TrueColor",
    },
    {
      label: "False Color (Vegetation & Burn Scars - Bands 3,6,7)",
      value: "MODIS_Terra_CorrectedReflectance_Bands367",
    },
    {
      label: "False Color (Moisture & Surface - Bands 7,2,1)",
      value: "MODIS_Terra_CorrectedReflectance_Bands721",
    },
  ];

  const baseMonthDate = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(baseMonthDate).getDate();
  const selectedDate = addDays(baseMonthDate, sliderValue);

  useEffect(() => {
    setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  const baseLayer = formattedDate
    ? `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${selectedLayer}/default/${formattedDate}/250m/{z}/{y}/{x}.jpg`
    : "";

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);
    setSliderValue(0);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);
    setSliderValue(0);
  };

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLayer(e.target.value);
  };

  const modisOptions = modisLayers.map((layer) => ({
    value: layer.value,
    label: layer.label,
  }));

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

        <div
          className="label_container"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Month */}
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

          {/* Year */}
          <label>
            <select
              value={year}
              onChange={handleYearChange}
              style={{
                padding: "0.3rem",
                backgroundColor: "#222",
                color: "#fff",
                border: "1px solid #555",
              }}
            >
              {Array.from(
                { length: today.getFullYear() - 2002 + 1 },
                (_, i) => {
                  const yr = today.getFullYear() - i;
                  return (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  );
                }
              )}
            </select>
          </label>

          {/* MODIS Layer */}
          <label>
            <Select
              options={modisOptions}
              isSearchable={false}
              value={modisOptions.find((o) => o.value === selectedLayer)}
              onChange={(option) => {
                if (option) setSelectedLayer(option.value);
              }}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#222",
                  borderColor: "#555",
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#222",
                  zIndex: 10000,
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 10000,
                }),
                option: (base, state) => ({
                  ...base,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  backgroundColor: state.isFocused ? "#444" : "#222",
                  color: "#fff",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
              }}
              menuPortalTarget={document.body}
              menuPosition="absolute"
            />
          </label>

          <b>{formattedDate}</b>
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

        <MapContainer
          className="sat_map_container"
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
            key={`${formattedDate}-${selectedLayer}`}
            url={baseLayer}
            attribution="NASA GIBS - MODIS Reflectance"
            tileSize={512}
            opacity={1}
            zIndex={1}
            noWrap
            updateWhenZooming={false}
            updateWhenIdle={true}
          />
        </MapContainer>
      </div>
    </Container>
  );
};

export default SnowMap;
