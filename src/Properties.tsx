import React, { useEffect, useState } from "react";
import "./Properties.css";
import bg from "./img/bg.jpg";
import bg2 from "./img/bg4.jpg";
import bg3 from "./img/bg3.jpg";
import bg4 from "./img/bg2.jpg";
import App from "./App";

function WindowsXPDisplayProperties() {
  const wallpapers = { bg, bg2, bg3, bg4 };

  // Mapping of wallpaper keys to custom display names
  const wallpaperNames = {
    bg: "Bliss",
    bg2: "Autumn Leaves",
    bg3: "Mountain Peak",
    bg4: "Serene Lake",
  };

  // Load the initial wallpaper from local storage or default to "bg"
  const getInitialWallpaper = () => {
    const savedWallpaper = localStorage.getItem("selectedWallpaper");
    return savedWallpaper ? (savedWallpaper as keyof typeof wallpapers) : "bg";
  };

  const [selectedWallpaper, setSelectedWallpaper] =
    useState<keyof typeof wallpapers>(getInitialWallpaper);

  useEffect(() => {
    // Set the body background image when the component mounts
    document.body.style.backgroundImage = `url(${wallpapers[selectedWallpaper]})`;
  }, [selectedWallpaper, wallpapers]);

  const handleOkClick = () => {
    // Save the selected wallpaper to local storage
    localStorage.setItem("selectedWallpaper", selectedWallpaper);
    // Change the body background image to the selected wallpaper
    document.body.style.backgroundImage = `url(${wallpapers[selectedWallpaper]})`;
  };

  return (
    <div className="properties-window">
      <div className="window-body">
        <div className="tab-menu">
          <div className="tab">Themes</div>
          <div className="tab selected">Desktop</div>
          <div className="tab">Settings</div>
        </div>
        <div className="content">
          <div className="wallpaper-selection">
            <div
              className="wallpaper-preview"
              style={{
                backgroundImage: `url(${wallpapers[selectedWallpaper]})`,
              }}
            >
              <div
                className={`wallpaper ${selectedWallpaper.toLowerCase()}`}
              ></div>
            </div>
            <div className="wallpaper-list">
              <label htmlFor="wallpaper">Background:</label>
              <select
                id="wallpaper"
                value={selectedWallpaper}
                onChange={(e) => {
                  setSelectedWallpaper(
                    e.target.value as keyof typeof wallpapers
                  );
                }}
              >
                {Object.keys(wallpaperNames).map((wallpaper) => (
                  <option key={wallpaper} value={wallpaper}>
                    {wallpaperNames[wallpaper as keyof typeof wallpaperNames]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="window-footer">
          <button className="btn" onClick={handleOkClick}>
            OK
          </button>
          <button className="btn" onClick={handleOkClick}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default WindowsXPDisplayProperties;
