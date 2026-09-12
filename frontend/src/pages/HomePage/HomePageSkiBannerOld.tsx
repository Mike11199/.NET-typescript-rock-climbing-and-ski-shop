import React from "react";
const AnimationSkierVectorImage = "https://assets.alpine-peak-climbing-ski-gear.com/site/76df6bf9d48fad9c/skier_vector.png";
const AnimationSlopeBackgroundImage = "https://assets.alpine-peak-climbing-ski-gear.com/site/5b9a7cc31622e874/ski_slope_6.png";
import Snowfall from "react-snowfall";
const CloudVector = "https://assets.alpine-peak-climbing-ski-gear.com/site/377ef3152c7f0a3c/cloud_vector3.png";
const AnimationTree = "https://assets.alpine-peak-climbing-ski-gear.com/site/920705c0f8221472/tree.png";
const AnimationSkiChairImage = "https://assets.alpine-peak-climbing-ski-gear.com/site/a6e3dc9a66d1df2d/ski_chair.png";


const HomePageSkiBannerOld = () => {
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
    <div className="banner_box_container_old">
      <div className="ski_banner_box_container_old">
      <div className="ski_banner_box_old">
      <Snowfall />
          <img
            className="skier_banner_slope"
            alt="skier_slope"
            src={AnimationSlopeBackgroundImage}


          />
          <img className="tree" alt="tree" src={AnimationTree} />
          {skiChairs}
          {cloudVectors}
          <div
            className="skier_wrapper"
            // onClick={(e) => {
            //   const img = e.currentTarget.querySelector(".skier_banner_vector");
            //   if (!img) return;

            //   img.classList.add("jump");

            //   img.addEventListener(
            //     "animationend",
            //     () => img.classList.remove("jump"),
            //     { once: true }
            //   );
            // }}
          >
            <img
              className="skier_banner_vector"
              alt="skier_vector"
              src={AnimationSkierVectorImage}
            />
      </div>
      </div>
      </div>
    </div>
  );
};

export default HomePageSkiBannerOld;