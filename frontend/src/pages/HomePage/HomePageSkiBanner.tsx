import React from "react";
import AnimationSkierVectorImage from "../../images/ski_banner_video.mp4";

const HomePageSkiBanner = () => {
  return (
    <div className="banner_box_container">
      <div className="ski_banner_box_container">
      <div className="ski_video_wrapper">
          <video
          style={{width: "100%",  objectFit: "cover", height: "100%"}}
            src={"https://res.cloudinary.com/dwgvi9vwb/video/upload/v1744594644/ski_banner_video_oxscii.mp4"}
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
