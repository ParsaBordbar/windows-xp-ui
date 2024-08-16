import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "./Media.css";
import "./Explorer.css";
import myComputerIcon from "./img/computer.png";
import folderIcon from "./img/document.png";
import fileIcon from "./img/mp3.png";
import audiofile from "./music/music.mp3";
import { ambience } from "./img";
import {
  computer,
  profileImg,
  startIcon,
  trashbin,
  cmd,
  instagram,
  telegram,
  email,
  mediaPlayer,
  playCover,
  off,
  myDocuments,
  runApp,
  help,
  controlPanel,
  searchIcon,
  mediaMenu,
  galleryIcon,
  dance,
  textIcon,
} from "./img";

const screen = document.querySelector(".screen-content") as HTMLElement | null;

const App: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const music = document.querySelector("#music") as HTMLAudioElement | null;
  const playMusic = () => {
    if (music) {
      music.play();
    }
  };

  //Bring the apps to front!

  const [zIndex, setZIndex] = useState<{ [key: string]: number }>({
    windowCmd: 1,
    windowMehdi: 1,
    windowMedia: 1,
    windowExplorer: 1,
  });
  const bringToFront = (windowId: string) => {
    setZIndex((prevZIndex) => {
      const newZIndex = { ...prevZIndex };
      Object.keys(newZIndex).forEach((id) => {
        if (id === windowId) {
          newZIndex[id] = Math.max(...Object.values(newZIndex)) + 1;
        }
      });
      return newZIndex;
    });
  };

  const [folders] = useState([
    { name: "Documents", icon: folderIcon },
    { name: "Pictures", icon: folderIcon },
  ]);

  const [files] = useState([
    { name: "Info.txt", icon: textIcon },
    { name: "File2.doc", icon: fileIcon },
    { name: "File3.pdf", icon: fileIcon },
  ]);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null
  );
  const progress = document.querySelector(
    ".progress-level"
  ) as HTMLElement | null;
  const [refreshTime, setRefreshTime] = useState<number>(0);
  const [musicTime, setMusicTime] = useState<number>(0);

  //default positions for apps on launch

  const defaultPositions = {
    windowCmd: { x: 100, y: 100 },
    windowMehdi: { x: 300, y: 100 },
  };

  // new positions

  const [position, setPosition] = useState<{
    [key: string]: { x: number; y: number };
  }>({
    windowCmd: { x: 497, y: 32 },
    windowMehdi: { x: 402, y: 234 },
    windowMedia: { x: 546, y: 185 },
    windowExplorer: { x: 707, y: 116 },
  });

  const [size, setSize] = useState({ width: 300, height: 400 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 600, height: 400 });
  const [startMenuOpened, setStartMenuOpened] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const clickTimeout = useRef<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const startSelectionCoords = useRef<{ x: number; y: number } | null>(null);
  const [windowsState, setWindowsState] = useState({
    commandPrompt: { x: 0, y: 0, width: 600, height: 400, dragging: false },
    mediaPlayer: { x: 0, y: 0, width: 600, height: 400, dragging: false },
    gallery: { x: 0, y: 0, width: 600, height: 400, dragging: false },
    profile: { x: 0, y: 0, width: 600, height: 400, dragging: false },
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const handleMenuItemClick = (action: string) => {
    setContextMenu(null);
    // Implement actions based on the menu item clicked
    switch (action) {
      case "refresh":
        setRefreshTime((refreshTime || 0) + 1);
        console.log(refreshTime);
        const icons = document.querySelector(".icons") as HTMLElement | null;
        if (icons) {
          icons.style.display = "none";
          setTimeout(() => {
            icons.style.display = "block";
          }, 200);
        }
        // Implement refresh logic
        break;
      case "properties":
        console.log("Properties action triggered");
        // Implement properties logic
        break;
      case "socials":
        console.log("New action triggered");
        // Implement new logic
        break;
      case "instagram":
        window.open("https://instagram.com/mehditohidi_", "_blank");
        // Implement undo move logic
        break;
      case "telegram":
        window.open("https://t.me/Themeht", "_blank");
        // Implement paste logic
        break;
      case "contact":
        window.open("mailto:mehditohidi9@gmail.com", "_blank");
        break;
    }
  };

  if (music && music.currentTime > 0 && progress) {
    setInterval(() => {
      setMusicTime(Math.round(music.currentTime));
      const barTime = (music.currentTime / music.duration) * 100;
      progress.style.width = barTime.toFixed(2) + "%";
    }, 1000);
  }
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest(".context-menu") && !target.closest(".program")) {
      setContextMenu(null);
    }

    if (target.closest(".menu-column")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }

    if (!target.closest(".window") && !target.closest(".program")) {
      setSelectedWindow(null);
    }
    if (!target.closest(".start-menu") && !target.closest(".taskbar")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }
    if (!target.closest("#images") && !target.closest(".user-image")) {
      const myImage = document.querySelector(
        ".imageShow"
      ) as HTMLElement | null;
      if (myImage) {
        myImage.style.display = "none";
      }
    }
    if (target.closest(".user-image")) {
      const startMenu = document.querySelector(
        ".start-menu"
      ) as HTMLElement | null;
      if (startMenu) {
        setStartMenuOpened(false);
        startMenu.style.display = "none";
      }
    }
  };

  useEffect(() => {
    const music = document.querySelector("#music") as HTMLAudioElement | null;

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const centerWindow = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        windowCmd: { x: 49, y: 10 },
        windowMehdi: { x: 40, y: 200 },
        windowMedia: { x: 54, y: 50 },
        windowExplorer: { x: 77, y: 150 },
      });
    };

    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, [size.width, size.height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    if (e.button === 0) {
      bringToFront(id);
      setDragging(true);
      setDraggingElementId(id);
      offset.current = {
        x: e.clientX - position[id]?.x,
        y: e.clientY - position[id]?.y,
      };
    } else if (e.button === 2) {
      handleContextMenu(e);
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>,
    elementId: string
  ) => {
    setDragging(true);
    console.log("TouchStart Triggered for element:", elementId);
    const touch = e.touches[0];
    bringToFront(elementId);
    setDraggingElementId(elementId);

    const element = document.querySelector(`#${elementId}`) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      console.log("Element Rect:", rect);
      offset.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      console.log("Offset Set:", offset.current);
    } else {
      console.error("Element not found:", elementId);
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && draggingElementId) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;

      // Apply constraints
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + size.width > window.innerWidth)
        newX = window.innerWidth - size.width;
      if (newY + size.height > window.innerHeight)
        newY = window.innerHeight - size.height;

      // Update the position for the dragged element
      setPosition((prevPosition) => ({
        ...prevPosition,
        [draggingElementId]: { x: newX, y: newY },
      }));
    } else if (isSelecting && startSelectionCoords.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const startX = startSelectionCoords.current.x;
        const startY = startSelectionCoords.current.y;
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        setSelection({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        });
      }
    }
  };

  const partyLights = document.getElementById("partyLights");
  // Function to turn on the party lights
  function turnOnLights() {
    if (partyLights) {
      partyLights.classList.add("on");
    }
  }

  // Function to turn off the party lights
  function turnOffLights() {
    if (partyLights) {
      partyLights.classList.remove("on");
    }
  }

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setIsSelecting(false);

    // Optionally, finalize the selection rectangle here if needed
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setResizing(true);
    offset.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && draggingElementId) {
        // Dragging logic
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;

        // Apply constraints to prevent the window from going outside the viewport
        const windowWidth = size.width;
        const windowHeight = size.height;
        const constrainedX = Math.max(
          0,
          Math.min(newX, window.innerWidth - windowWidth)
        );
        const constrainedY = Math.max(
          0,
          Math.min(newY, window.innerHeight - windowHeight)
        );

        setPosition((prevPosition) => ({
          ...prevPosition,
          [draggingElementId]: { x: constrainedX, y: constrainedY },
        }));
      } else if (resizing) {
        setSize({
          width: startSize.current.width + (e.clientX - offset.current.x),
          height: startSize.current.height + (e.clientY - offset.current.y),
        });
      } else if (isSelecting && startSelectionCoords.current) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const startX = startSelectionCoords.current.x;
          const startY = startSelectionCoords.current.y;
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          setSelection({
            x: Math.min(startX, currentX),
            y: Math.min(startY, currentY),
            width: Math.abs(currentX - startX),
            height: Math.abs(currentY - startY),
          });
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, resizing, isSelecting]);

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
          response = `
          Hello! I'm Mehdi Tohidi. Currently I'm living in Iran. I Can Code Everything!

          You can run the 'Mehdi Tohidi' App to know more about me.
        `;
          break;
        case "clear":
          setCommands([]);
          inputField.value = "";
          return;
        default:
          response = `'${command}' is not recognized as an internal or external command, operable program or batch file.`;
      }

      setCommands((prev) => [
        ...prev,
        `C:\\Users\\MehdiTohidi> ${command}`,
        response,
      ]);
      inputField.value = "";
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    console.log("Touch Move: ", e.touches[0].clientX, e.touches[0].clientY);
    if (dragging && draggingElementId) {
      const touch = e.touches[0];
      let newX = touch.clientX - offset.current.x;
      let newY = touch.clientY - offset.current.y;

      console.log("New X:", newX, "New Y:", newY);

      // Apply constraints
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + size.width > window.innerWidth)
        newX = window.innerWidth - size.width;
      if (newY + size.height > window.innerHeight)
        newY = window.innerHeight - size.height;

      console.log("Constrained X:", newX, "Constrained Y:", newY);

      // Update the position for the dragged element
      setPosition((prevPosition) => ({
        ...prevPosition,
        [draggingElementId]: { x: newX, y: newY },
      }));
    } else if (isSelecting && startSelectionCoords.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        const startX = startSelectionCoords.current.x;
        const startY = startSelectionCoords.current.y;
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        setSelection({
          x: Math.min(startX, currentX),
          y: Math.min(startY, currentY),
          width: Math.abs(currentX - startX),
          height: Math.abs(currentY - startY),
        });
      }
    }
  };

  const handleProgramClick = (programId: string) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    clickTimeout.current = window.setTimeout(() => {
      setSelectedWindow(programId);
    }, 200);
  };

  const handleProgramDoubleClick = (programId: string) => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    setOpenWindows((prev) => [...prev, programId]);
    setSelectedWindow(programId);
  };

  const closeWindow = (programId: string) => {
    setOpenWindows((prev) => prev.filter((win) => win !== programId));
    if (programId === "commandPrompt") {
      setCommands([]);
    }
  };

  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();

  let current_time =
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute);

  const startSelection = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const isTouchEvent = e.type === "touchstart";
    const clientX = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent
      ? (e as React.TouchEvent).touches[0].clientY
      : (e as React.MouseEvent).clientY;

    // If it's a mouse event, check if it's a left click
    if (!isTouchEvent && (e as React.MouseEvent).button !== 0) {
      return; // Not a left click, so we ignore it
    }

    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      startSelectionCoords.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      setIsSelecting(true);
    }
  };

  const endSelection = () => {
    setIsSelecting(false);
    startSelectionCoords.current = null; // Clear the initial position
    setSelection({
      x: Math.min(0, 0),
      y: Math.min(0, 0),
      width: Math.abs(0),
      height: Math.abs(0),
    });
  };

  return (
    <div className="app">
      <div className="imageShow">
        <img id="images" src={profileImg} />
      </div>
      {/* Command Prompt Window */}
      <div
        id="windowCmd"
        onClick={() => bringToFront("windowCmd")}
        className="window"
        style={{
          display: openWindows.includes("commandPrompt") ? "flex" : "none",
          transform: `translate(${position["windowCmd"]?.x}px, ${position["windowCmd"]?.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: zIndex["windowCmd"],
        }}
      >
        <div
          className="title-bar"
          onMouseDown={(e) => handleMouseDown(e, "windowCmd")}
          onTouchStart={(e) => handleTouchStart(e, "windowCmd")}
        >
          <div className="title">Command Prompt</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("commandPrompt");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div className="terminal">
          <div id="output">
            <div>Microsoft Windows [Version 10.0.22621.3958]</div>
            <div>(c) Microsoft Corporation. All rights reserved.</div>
            <br />
            <div style={{ fontSize: 12 }}>
              Available commands: help, about, clear
            </div>
            <br />
            {commands.map((cmd, index) => (
              <div key={index}>{cmd}</div>
            ))}
            <div className="input-line">
              <span className="prompt">C:\Users\MehdiTohidi{">"}</span>
              <input type="text" autoFocus onKeyDown={handleKeyDown} />
            </div>
          </div>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={(e) => handleTouchStart(e, "windowCmd")}
        ></div>
      </div>

      {/* Mehdi Tohidi */}
      <div
        id="windowMehdi"
        className="window"
        onClick={() => bringToFront("windowMehdi")}
        style={{
          display: openWindows.includes("profile") ? "flex" : "none",
          transform: `translate(${position["windowMehdi"]?.x}px, ${position["windowMehdi"]?.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: zIndex["windowMehdi"],
        }}
      >
        <div
          className="title-bar"
          style={{ backgroundColor: "darkPurple" }}
          onMouseDown={(e) => handleMouseDown(e, "windowMehdi")}
          onTouchStart={(e) => handleTouchStart(e, "windowMehdi")}
        >
          <div className="title">Mehdi Tohidi | About Me!</div>
          <button
            className="close"
            onClick={() => {
              closeWindow("profile");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div className="aboutMe">
          <p id="aboutText">
            I'm Mehdi Tohidi! Currently I'm living in Iran. My Skills:
            <ul id="skills">
              <li>Web Developing.</li>
              <li>Mobile App Developing.</li>
              <li>Telegram Mini App Developing.</li>
              <li>Telegram Bot Developing.</li>
            </ul>
            I love teamworks. I can speak in:
            <ul id="skills">
              <li>English</li>
              <li>Persian</li>
              <li>Kurdish: Sorani</li>
              <li>Turkish: Azari</li>
            </ul>
            I'm also in AI! I love creating digital arts with Artificial
            Intelligance.
          </p>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={(e) => handleTouchStart(e, "windowMehdi")}
        ></div>
      </div>

      {/* Explorer */}

      <div
        id="windowExplorer"
        className="window"
        onClick={() => bringToFront("windowExplorer")}
        style={{
          display: openWindows.includes("documents") ? "flex" : "none",
          transform: `translate(${position["windowExplorer"]?.x}px, ${position["windowExplorer"]?.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          zIndex: zIndex["windowExplorer"],
        }}
      >
        <div
          className="title-bar"
          style={{
            backgroundColor: "darkPurple",
          }}
          onMouseDown={(e) => {
            handleMouseDown(e, "windowExplorer");

            const windowExplorer = document.querySelector(
              "#windowExplorer"
            ) as HTMLElement | null;
            if (windowExplorer) {
              // Get the current zIndex and convert it to a number
              const currentZIndex =
                parseInt(windowExplorer.style.zIndex, 10) || 0;

              // Increment the zIndex
              windowExplorer.style.zIndex = (currentZIndex + 100000).toString();
            }
          }}
          onTouchStart={(e) => handleTouchStart(e, "windowExplorer")}
        >
          <div className="title" id="documents">
            My Documents
          </div>
          <button
            className="close"
            onClick={() => {
              closeWindow("documents");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div className="menu-bar">
          <div className="menu-item">File</div>
          <div className="menu-item">Edit</div>
          <div className="menu-item">View</div>
          <div className="menu-item">Favorites</div>
          <div className="menu-item">Tools</div>
          <div className="menu-item">Help</div>
        </div>
        <div className="address-bar">
          <div className="address-bar-label">Address</div>
          <input type="text" value="C:\\" readOnly />
        </div>
        <div className="explorer-content">
          <div className="sidebar">
            <div className="sidebar-item">
              <img src={myComputerIcon} alt="My Computer" />
              <span>MehdiTohidi.com</span>
            </div>

            {/* Add more sidebar items as needed */}
          </div>
          <div className="main-view">
            <div className="file-section">
              {files.map((file, index) => (
                <div className="file-item" key={index}>
                  <img src={file.icon} alt="File" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Player */}
      <div
        id="windowMedia"
        className="window"
        style={{
          display: openWindows.includes("mediaPlayer") ? "flex" : "none",
          transform: `translate(${position["windowMedia"]?.x}px, ${position["windowMedia"]?.y}px)`,
          width: "300px",
          zIndex: zIndex["windowMedia"],
        }}
      >
        <div
          className="title-bar"
          style={{
            backgroundColor: "darkPurple",
          }}
          onMouseDown={(e) => {
            turnOnLights();
            handleMouseDown(e, "windowMedia");
          }}
          onTouchStart={(e) => handleTouchStart(e, "windowMedia")}
        >
          <div className="title" id="mediaPlayer">
            Media Player
          </div>
          <button
            className="close"
            onClick={() => {
              if (music) {
                music.pause();
                music.currentTime = 0;
                const lights = document.querySelector(
                  ".party-lights"
                ) as HTMLElement | null;
                const dancing = document.querySelector(
                  ".dancing"
                ) as HTMLElement | null;
                if (dancing && lights) {
                  dancing.style.display = "none";
                  lights.style.display = "none";
                }
              }
              closeWindow("mediaPlayer");
              setSelection({
                x: Math.min(0, 0),
                y: Math.min(0, 0),
                width: Math.abs(0),
                height: Math.abs(0),
              });
            }}
          ></button>
        </div>
        <div id="mediaAll">
          <div className="screen">
            <div className="screen-content"></div>
          </div>
          <div className="controls-bar">
            <audio id="music" src={audiofile}></audio>
            <button id="control-button" className="control-button prev">
              |◀
            </button>

            <button
              id="control-button"
              className="control-button play"
              onClick={() => {
                const music = document.querySelector(
                  "#music"
                ) as HTMLAudioElement | null;
                const screen =
                  document.querySelector<HTMLElement>(".screen-content");
                if (music && screen) {
                  music.play();
                  screen.style.backgroundImage = "url('" + ambience + "')";
                  const lights = document.querySelector(
                    ".party-lights"
                  ) as HTMLElement | null;
                  if (lights) {
                    lights.style.display = "block";
                  }
                  const dancing = document.querySelector(
                    ".dancing"
                  ) as HTMLElement | null;
                  if (dancing) {
                    dancing.style.display = "block";
                  }
                } else {
                  console.log("Music or screen element not found");
                }
              }}
            >
              ▶
            </button>

            <button
              id="control-button"
              className="control-button pause"
              onClick={() => {
                const music = document.querySelector(
                  "#music"
                ) as HTMLAudioElement | null;
                if (screen && music) {
                  music.pause();
                  screen.style.backgroundImage = "url('" + playCover + "')";
                  const lights = document.querySelector(
                    ".party-lights"
                  ) as HTMLElement | null;
                  const dancing = document.querySelector(
                    ".dancing"
                  ) as HTMLElement | null;
                  if (dancing && lights) {
                    dancing.style.display = "none";
                    lights.style.display = "none";
                  }
                }
              }}
            >
              ||
            </button>
            <button
              id="control-button"
              className="control-button stop"
              onClick={() => {
                const music = document.querySelector(
                  "#music"
                ) as HTMLAudioElement | null;
                if (music && screen) {
                  screen.style.backgroundImage = "url('" + playCover + "')";
                  music.pause();
                  music.currentTime = 0;
                  const lights = document.querySelector(
                    ".party-lights"
                  ) as HTMLElement | null;
                  const dancing = document.querySelector(
                    ".dancing"
                  ) as HTMLElement | null;
                  if (dancing && lights) {
                    dancing.style.display = "none";
                    lights.style.display = "none";
                  }
                }
              }}
            >
              ■
            </button>
          </div>

          <div className="status-bar">
            <div className="status-text">
              {Math.floor(musicTime / 60) < 10
                ? "0" + Math.floor(musicTime / 60)
                : Math.floor(musicTime / 60)}
              :{musicTime % 60 < 10 ? "0" + (musicTime % 60) : musicTime % 60}/
              04:54
            </div>
            <div className="progress-bar">
              <div className="progress-level" style={{ width: "0%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dancing */}

      <div
        className="dancing"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        <img id="dancing" src={dance} />
      </div>

      {/* Taskbar */}
      <div className="taskbar" onContextMenu={(e) => e.preventDefault()}>
        <div className="taskbar-start">
          <div className="start-menu-button">
            <img
              id="startIcon"
              src={startIcon}
              alt="Start Menu"
              onClick={() => {
                // handle start menu click
                const startMenu = document.querySelector(
                  ".start-menu"
                ) as HTMLElement | null;

                if (startMenu && !startMenuOpened) {
                  startMenu.style.display = "block";
                  setStartMenuOpened(true);
                } else if (startMenu && startMenuOpened) {
                  startMenu.style.display = "none";
                  setStartMenuOpened(false);
                }
              }}
            />
          </div>
        </div>
        <div className="taskbar-end">
          <div className="taskbar-clock">{current_time}</div>
        </div>
        <div className="taskbar-open-windows">
          {openWindows.includes("documents") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={myDocuments}
                alt="My Documents"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("documents")}
              />
              <p id="taskbarText">My Documents</p>
            </div>
          )}
          {openWindows.includes("mediaPlayer") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={mediaPlayer}
                alt="Media Player"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("mediaPlayer")}
              />
              <p id="taskbarText">Jelly Bean Miche...</p>
            </div>
          )}
          {openWindows.includes("gallery") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={galleryIcon}
                alt="Recycle Bin"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("gallery")}
              />
              <p id="taskbarText">My Gallery</p>
            </div>
          )}
          {openWindows.includes("profile") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={profileImg}
                alt="Profile"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("profile")}
              />
              <p id="taskbarText">Mehdi Tohidi</p>
            </div>
          )}
          {openWindows.includes("commandPrompt") && (
            <div className="taskbar-item">
              <img
                id="taskImage"
                src={cmd}
                alt="Command Prompt"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("commandPrompt")}
              />
              <p id="taskbarText">Command Prompt</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="icons">
        <div
          className={`program ${
            selectedWindow === "documents" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("documents")}
          onDoubleClick={() => handleProgramDoubleClick("documents")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            id="iconImage"
            style={{
              width: 50,
              height: 50,
              marginBottom: 20,
              justifySelf: "center",
            }}
            src={myDocuments}
          />
          <p id="programName">My Documents</p>
        </div>

        <div
          className={`program ${
            selectedWindow === "mediaPlayer" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("mediaPlayer")}
          onDoubleClick={() => handleProgramDoubleClick("mediaPlayer")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            id="iconImage"
            style={{ width: 45, justifySelf: "center", paddingBottom: 20 }}
            src={mediaPlayer}
          />
          <p id="programName">
            Jelly Bean - <br />
            Micheal Jackson
          </p>
        </div>
        <div
          className={`program ${
            selectedWindow === "gallery" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("gallery")}
          onDoubleClick={() => handleProgramDoubleClick("gallery")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            id="iconImage"
            src={galleryIcon}
            style={{
              width: 45,
              height: 45,
              marginBottom: 20,
              justifySelf: "center",
            }}
          />
          <p id="programName">My Gallery</p>
        </div>
        <div
          className={`program ${
            selectedWindow === "profile" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("profile")}
          onDoubleClick={() => handleProgramDoubleClick("profile")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img
            id="iconImage"
            src={profileImg}
            style={{
              width: 45,
              justifySelf: "center",
              marginBottom: "25px",
              marginTop: "20px",
              borderRadius: "5px",
            }}
          />
          <p id="programName">Mehdi Tohidi</p>
        </div>
        <div
          className={`program ${
            selectedWindow === "commandPrompt" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("commandPrompt")}
          onDoubleClick={() => handleProgramDoubleClick("commandPrompt")}
        >
          <img
            id="iconImage"
            src={cmd}
            style={{
              width: 45,
              justifySelf: "center",
              marginBottom: "25px",
              marginTop: "20px",
            }}
          />
          <p id="programName">Command Prompt</p>
        </div>
      </div>

      {/* Start Menu */}

      <div className="start-menu">
        <div className="start-menu-header">
          <img
            src={profileImg}
            alt="User"
            className="user-image"
            onClick={() => {
              const image = document.querySelector(
                ".imageShow"
              ) as HTMLElement | null;
              if (image) {
                image.style.display = "flex";
              }
            }}
          />
          <p className="username">Mehdi Tohidi</p>
        </div>
        <div className="start-menu-content">
          <div className="menu-column">
            <ul>
              <li onClick={() => handleProgramDoubleClick("documents")}>
                <img id="menuIcons" src={myDocuments} alt="Program" /> My
                Documents
              </li>
              <li onClick={() => handleProgramDoubleClick("profile")}>
                <img
                  style={{ borderRadius: 5 }}
                  src={profileImg}
                  alt="Program"
                />{" "}
                Mehdi Tohidi
              </li>

              <li onClick={() => handleProgramDoubleClick("mediaPlayer")}>
                <img src={mediaMenu} alt="Program" /> Media Player
              </li>
              <li onClick={() => handleProgramDoubleClick("commandPrompt")}>
                <img src={cmd} alt="Program" /> Command Prompt
              </li>
            </ul>
          </div>
          <div className="menu-column">
            <ul>
              <li>
                <img src={controlPanel} alt="Program" /> Control Panel
              </li>
              <li>
                <img src={help} alt="Program" /> Help and Support
              </li>
              <li>
                <img src={searchIcon} alt="Program" /> Search
              </li>
              <li>
                <img src={runApp} alt="Program" /> Run...
              </li>
            </ul>
          </div>
        </div>
        <div className="start-menu-footer">
          <div className="left"></div>
          <button id="shutButton" className="shutdown">
            <img id="offImg" src={off} />
            Shut Down
          </button>
        </div>
      </div>

      {/* App Container */}
      <div id="partyLights" className="party-lights"></div>
      <div
        onMouseDown={startSelection}
        onTouchStart={startSelection}
        onTouchEnd={endSelection}
        onMouseUp={endSelection}
        onMouseMove={(e) => handleMouseMove(e as any)} // Cast to any to match MouseEvent type
        onContextMenu={handleContextMenu}
        className="app-container"
        ref={containerRef}
      >
        <div className="content"></div>

        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="context-menu"
            style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          >
            <ul>
              <li onClick={() => handleMenuItemClick("refresh")}>Refresh</li>

              <li onClick={() => handleMenuItemClick("socials")}>
                My Socials:
              </li>
              <li onClick={() => handleMenuItemClick("instagram")}>
                <img id="socials" src={instagram} /> @mehditohidi_
              </li>
              <li onClick={() => handleMenuItemClick("telegram")}>
                <img id="socials" src={telegram} />
                @themeht
              </li>
              <li onClick={() => handleMenuItemClick("contactEmail")}>
                <img id="socials" src={email} />
                Mehditohidi9@gmail.com
              </li>
              <li onClick={() => handleMenuItemClick("properties")}>
                Contact Me For Buissness
              </li>
            </ul>
          </div>
        )}

        {isSelecting && (
          <div
            className="selection-rectangle"
            style={{
              left: selection.x,
              top: selection.y,
              width: selection.width,
              height: selection.height,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default App;
