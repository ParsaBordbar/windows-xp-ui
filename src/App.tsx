import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { computer, profileImg, startIcon, trashbin } from "./img";
import { cmd } from "./img";
import { profile } from "console";
import { ButtonTransaction } from "frog/_lib/components/Button";
const App: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 600, height: 400 });

  // Center window on initial render
  useEffect(() => {
    const centerWindow = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      setPosition({
        x: (windowWidth - size.width) / 2,
        y: (windowHeight - size.height) / 2,
      });
    };

    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, [size.width, size.height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    } else if (resizing) {
      setSize({
        width: startSize.current.width + (e.clientX - offset.current.x),
        height: startSize.current.height + (e.clientY - offset.current.y),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent dragging while resizing
    setResizing(true);
    offset.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputField = event.target as HTMLInputElement;
      const command = inputField.value.trim();

      let response = "";
      switch (command.toLowerCase()) {
        case "help":
          response = "Available commands: help, about, clear";
          break;
        case "about":
          response =
            "Hello! I'm Mehdi Tohidi. Currently I'm living in Iran. I Can Code Everything! Contact me by Email: Mehditohidi9@gmail.com";
          break;
        case "clear":
          setCommands([]);
          inputField.value = "";
          return;
        default:
          response = `' ${command}'is not recognized as an internal or external command, operable program or batch file.`;
      }

      setCommands((prev) => [
        ...prev,
        `C:\\Users\\MehdiTohidi> ${command}`,
        response,
      ]);
      inputField.value = "";
    }
  };
  let date = new Date();
  let current_time = date.getHours() + ":" + date.getMinutes();
  return (
    <div className="app">
      <div
        className="window"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className="title-bar" onMouseDown={handleMouseDown}>
          <div className="title">Command Prompt {">"} MehdiTohidi.com</div>
          <button className="close" onClick={() => setCommands([])}></button>
        </div>
        <div className="terminal">
          <div id="output">
            <div>Microsoft Windows [Version 10.0.22621.3958]</div>
            <div>(c) Microsoft Corporation. All rights reserved.</div>
            <br />
            {commands.map((cmd, index) => (
              <div key={index}>{cmd}</div>
            ))}
            <div className="input-line">
              <span className="prompt">C:\Users\MehdiTohidi{">"}</span>
              <input
                type="text"
                id="input"
                autoFocus
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
        ></div>
      </div>
      <div className="taskbar">
        <div className="taskbar-start">
          <div className="taskbar-item taskbar-start-menu">
            {/* <img src="start-icon.png" alt="Start Menu"> */}
            <img
              id="startIcon"
              src={startIcon}
              onClick={() => {
                const startMenu = document.querySelector(".startMenu");
                if (startMenu) {
                  if ((startMenu as HTMLElement).style.display === "block") {
                    (startMenu as HTMLElement).style.display = "none";
                  } else if (
                    ((startMenu as HTMLElement).style.display = "none")
                  ) {
                    (startMenu as HTMLElement).style.display = "block";
                  }
                }
              }}
            />
            <div className="taskItems">
              <img id="cmd" src={cmd} />
            </div>
          </div>
        </div>
        <div className="taskbar-end">
          <div className="taskbar-clock">{current_time}</div>
        </div>
      </div>
      <div className="icons">
        <div className="program">
          <img id="iconImage" src={computer} />
          <p id="programName">My Computer</p>
        </div>
        <div className="program">
          <img id="iconImage" src={trashbin} />
          <p id="programName">Recycle Bin</p>
        </div>
        <div className="program">
          <img
            id="iconImage"
            src={profileImg}
            style={{
              borderRadius: "50%",
              width: 60,
              justifySelf: "center",
              marginBottom: "25px",
              marginTop: "20px",
            }}
          />
          <p id="programName">Mehdi Tohidi</p>
        </div>
      </div>
      <div className="startMenu"></div>
    </div>
  );
};

export default App;
