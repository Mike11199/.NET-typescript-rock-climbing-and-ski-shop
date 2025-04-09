import React, { useState } from "react";
import HomePageSkiBannerOld from "./HomePageSkiBannerOld";
import HomePageSkiBanner from "./HomePageSkiBanner";

const HomePageSkiBannerWrapper = () => {
  const [showOldBanner, setShowOldBanner] = useState(false);

  const handleClick = () => {
    setShowOldBanner(prev => !prev);
  };

  return (
    <div className="banner-box-container-wrapper" onClick={handleClick}>
      {showOldBanner ? (
        <HomePageSkiBannerOld />
      ) : (
        <HomePageSkiBanner />
      )}
    </div>
  );
};

export default HomePageSkiBannerWrapper;
