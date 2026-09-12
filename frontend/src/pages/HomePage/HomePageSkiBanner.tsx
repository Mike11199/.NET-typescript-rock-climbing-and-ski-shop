import React from "react";


const HomePageSkiBanner = () => {
  return (
    <div className="banner_box_container">
      <div className="ski_banner_box_container">
      <div className="ski_video_wrapper">
          <video
          style={{width: "100%",  objectFit: "cover", height: "100%"}}
            src={"https://assets.alpine-peak-climbing-ski-gear.com/site/63f8f64464f0c707/ski_banner_video_oxscii.mp4"}
            autoPlay
            muted
            loop
            playsInline
          />
      </div>
      </div>
    </div>
  );
};

export default HomePageSkiBanner;
