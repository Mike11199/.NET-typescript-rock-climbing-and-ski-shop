import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { format, startOfMonth, endOfMonth } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { Container } from "react-bootstrap";
import { LatLngExpression } from "leaflet";
import NASALogoImage from "../../images/nasa.png";
import NASALandSatImage from "../../images/landsat.png";
import Select from "react-select";
import HomePageNasaSatelliteSlider from "./HomePageNasaSatelliteSlider";

const SnowMap = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const baseMonthDate = startOfMonth(new Date(year, month));
  const initialSliderValue = Math.max(
    0,
    Math.floor(
      (today.getTime() - baseMonthDate.getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const [sliderValue, setSliderValue] = useState<number>(initialSliderValue);

  const [formattedDate, setFormattedDate] = useState<string>("");
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

  const baseLayer = formattedDate
    ? `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${selectedLayer}/default/${formattedDate}/250m/{z}/{y}/{x}.jpg`
    : "";

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setMonth(newMonth);

    if (year === today.getFullYear() && newMonth === today.getMonth()) {
      const daysFromStart = Math.floor(
        (today.getTime() - new Date(year, newMonth, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setSliderValue(daysFromStart);
    } else {
      setSliderValue(14); // 15th day (0-indexed)
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);

    // Clamp future year or invalid month combo
    if (
      newYear > today.getFullYear() ||
      (newYear === today.getFullYear() && month > today.getMonth())
    ) {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
      const daysFromStart = Math.floor(
        (today.getTime() -
          new Date(today.getFullYear(), today.getMonth(), 1).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setSliderValue(daysFromStart);
      return;
    }

    setYear(newYear);

    if (newYear === today.getFullYear() && month === today.getMonth()) {
      const daysFromStart = Math.floor(
        (today.getTime() - new Date(newYear, month, 1).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      setSliderValue(daysFromStart);
    } else {
      setSliderValue(14);
    }
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
            <h2 style={{fontWeight: "400"}}> Snow Tracker - NASA MODIS</h2>
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
                spectrum as well as other wavelengths such as infrared.
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
          <label>
            <select
              value={month}
              onChange={handleMonthChange}
              className="nasa-select-dropdown"
            >
              {[...Array(12).keys()].map((m) => {
                const isFutureMonth =
                  year === today.getFullYear() && m > today.getMonth();
                return (
                  <option
                    key={m}
                    value={m}
                    disabled={isFutureMonth}
                    title={
                      isFutureMonth ? "Cannot select a future month" : undefined
                    }
                  >
                    {format(new Date(2023, m), "MMMM")}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            <select
              value={year}
              onChange={handleYearChange}
              className="nasa-select-dropdown"
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

          <label>
            <Select
              classNamePrefix="nasa-select"
              className="nasa-select-wrapper"
              options={modisOptions}
              isSearchable={false}
              value={modisOptions.find((o) => o.value === selectedLayer)}
              onChange={(option) => option && setSelectedLayer(option.value)}
              menuPortalTarget={document.body}
              menuPosition="absolute"
            />
          </label>

          <b>{formattedDate}</b>
        </div>

        <HomePageNasaSatelliteSlider
          {...{ sliderValue, setSliderValue, setFormattedDate, baseMonthDate }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{format(baseMonthDate, "MMM d")}</span>
          <span>{format(endOfMonth(baseMonthDate), "MMM d")}</span>
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
