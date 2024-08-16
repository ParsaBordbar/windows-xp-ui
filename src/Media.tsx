import { playCover } from "./img";
import "./Media.css";

export const MediaPlayer = () => {
  return (
    <div className="media-player">
      <div className="screen">
        <div className="screen-content">
          <img style={{ width: 80, height: 80 }} src={playCover} />
          <div className="track-info">
            <div className="track-title">Jelly Bean</div>
            <div className="track-artist">Micheal Jackson</div>
          </div>
        </div>
      </div>
      <div className="controls-bar">
        <button className="control-button prev">|◀</button>
        <button className="control-button play">▶</button>
        <button className="control-button next">▶|</button>
        <button className="control-button stop">■</button>
      </div>
      <div className="volume-bar">
        <div className="volume-icon">🔊</div>
        <div className="volume-slider">
          <div className="volume-level" style={{ width: "50%" }}></div>
        </div>
      </div>
      <div className="status-bar">
        <div className="status-text">00:00 / 03:45</div>
        <div className="progress-bar">
          <div className="progress-level" style={{ width: "30%" }}></div>
        </div>
      </div>
    </div>
  );
};
