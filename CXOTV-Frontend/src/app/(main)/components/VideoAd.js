import React from "react";

const VideoAd = () => (
  <div className="w-full">
    <video
      width="335"
      height="200"
      muted
      loop
      playsInline
      preload="none"
      src="https://www.techplusmedia.com/cxotv-lx-ad.mp4"
      style={{ width: "100%", height: "auto", display: "block", borderRadius: "8px" }}
    />
  </div>
);

export default VideoAd;
