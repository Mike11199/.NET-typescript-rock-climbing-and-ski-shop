import { useEffect, SetStateAction } from "react";
import { addDays, format, endOfMonth } from "date-fns";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const HomePageNasaSatelliteSlider = ({
  sliderValue,
  setSliderValue,
  setFormattedDate,
  baseMonthDate,
}: {
  sliderValue: number;
  setSliderValue: React.Dispatch<SetStateAction<number>>;
  setFormattedDate: React.Dispatch<SetStateAction<string>>;
  baseMonthDate: Date;
}) => {
  const today = new Date();

  const selectedDate = addDays(baseMonthDate, sliderValue);

  useEffect(() => {
    if (selectedDate > today) {
      const clampedValue = Math.floor(
        (today.getTime() - baseMonthDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setSliderValue(Math.max(0, clampedValue));
    } else {
      setFormattedDate(format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, baseMonthDate, today]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    const proposedDate = addDays(baseMonthDate, val);
    if (proposedDate <= today) {
      setSliderValue(val);
    }
  };

  const progressPercent =
    (sliderValue / endOfMonth(baseMonthDate).getDate()) * 100;

  return (
    <input
      type="range"
      className="satellite-slider"
      min={0}
      max={endOfMonth(baseMonthDate).getDate()}
      value={sliderValue}
      onChange={handleSliderChange}
      style={{ "--progress": `${progressPercent}%` } as React.CSSProperties}
    />
  );
};

export default HomePageNasaSatelliteSlider;
