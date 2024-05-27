import React from "react";
import AnimationSkierVectorImage from "../../images/skier_vector.png";
import AnimationSlopeBackgroundImage from "../../images/ski_slope_6.png";
import Snowfall from "react-snowfall";
import CloudVector from "../../images/cloud_vector3.png";
import AnimationTree from "../../images/tree.png";
import AnimationSkiChairImage from "../../images/ski_chair.png";

const HomePageSkiBanner = () => {
  const numberOfChairs = 5;
  const numberOfClouds = 13;

  // chair images array
  const skiChairs = Array.from({ length: numberOfChairs }, (_, index) => (
    <img
      key={index}
      className={`ski_chair${index + 1}`}
      alt={`ski_chair${index + 1}`}
      src={AnimationSkiChairImage}
    />
  ));

  // cloud images array
  const cloudVectors = Array.from({ length: numberOfClouds }, (_, index) => (
    <img
      key={index}
      className={`cloud_banner_vector${index + 1}`}
      alt={`cloud_vector${index + 1}`}
      src={CloudVector}
    />
  ));

  return (
    <div className="banner_box_container">
      <div className="ski_banner_box">
        <Snowfall />
        <img
          className="skier_banner_slope"
          alt="skier_slope"
          src={AnimationSlopeBackgroundImage}
        />
        <img className="tree" alt="tree" src={AnimationTree} />
        {skiChairs}
        {cloudVectors}
        <img
          className="skier_banner_vector"
          alt="skier_vector"
          src={AnimationSkierVectorImage}
        />
      </div>
    </div>
  );
};

export default HomePageSkiBanner;
