import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { computer, profileImg, startIcon, trashbin, cmd } from "./img";

const App: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const [refreshTime, setRefreshTime] = useState<number>(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 600, height: 400 });
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
        if (refreshTime >= 2) {
          window.location.reload();
        }
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
      case "new":
        console.log("New action triggered");
        // Implement new logic
        break;
      case "undo move":
        console.log("Undo Move action triggered");
        // Implement undo move logic
        break;
      case "paste":
        console.log("Paste action triggered");
        // Implement paste logic
        break;
      case "paste shortcut":
        console.log("Paste Shortcut action triggered");
        // Implement paste shortcut logic
        break;
    }
  };

  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target.closest(".context-menu") && !target.closest(".program")) {
      setContextMenu(null);
    }

    if (!target.closest(".window") && !target.closest(".program")) {
      setSelectedWindow(null);
    }
  };

  useEffect(() => {
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
        x: (windowWidth - size.width) / 2,
        y: (windowHeight - size.height) / 2,
      });
    };

    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, [size.width, size.height]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      // Left click
      setDragging(true);
      offset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    } else if (e.button === 2) {
      // Right click
      handleContextMenu(e);
    }
  };
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setDragging(true);
    offset.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      let newX = e.clientX - offset.current.x;
      let newY = e.clientY - offset.current.y;
  
      // Prevent window from going off-screen
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + size.width > window.innerWidth) newX = window.innerWidth - size.width;
      if (newY + size.height > window.innerHeight) newY = window.innerHeight - size.height;
  
      setPosition({ x: newX, y: newY });
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

  

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setIsSelecting(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setResizing(true);
    offset.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };

  useEffect(() => {
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

          Contact me by Email: Mehditohidi9@gmail.com
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
    if (dragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - offset.current.x,
        y: touch.clientY - offset.current.y,
      });
    } else if (isSelecting && startSelectionCoords.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const touch = e.touches[0];
        const startX = startSelectionCoords.current.x;
        const startY = startSelectionCoords.current.y;
        const currentX = touch.clientX - offset.current.x;
        const currentY = touch.clientY - offset.current.y;

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

  let current_time = (hour<10 ? '0' + hour : hour) + ":" + (minute < 10 ? '0' + minute : minute);

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
      {/* Command Prompt Window */}
      <div
        className="window"
        style={{
          display: openWindows.includes("commandPrompt") ? "flex" : "none",
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
        <div className="title-bar" onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
          <div className="title">Command Prompt {">"} MehdiTohidi.com</div>
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
            }
          }
          ></button>
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
              <input type="text" autoFocus onKeyDown={handleKeyDown} />
            </div>
          </div>
        </div>
        <div
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          onTouchStart={handleTouchStart}
        ></div>
      </div>

      {/* Taskbar */}
      <div className="taskbar">
        <div className="taskbar-start">
          <div className="start-menu-button">
            <img
              id="startIcon"
              src={startIcon}
              alt="Start Menu"
              onClick={() => {
                // handle start menu click
              }}
            />
          </div>
        </div>
        <div className="taskbar-end">
          <div className="taskbar-clock">{current_time}</div>
        </div>
        <div className="taskbar-open-windows">
          {openWindows.includes("myComputer") && (
            <div className="taskbar-item">
              <img id="taskImage"
                src={computer}
                alt="My Computer"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("myComputer")}
              />
              <p id="taskbarText">My Computer</p>
            </div>
          )}
          {openWindows.includes("recycleBin") && (
            <div className="taskbar-item">
              <img id="taskImage"
                src={trashbin}
                alt="Recycle Bin"
                className="taskbar-icon"
                onClick={() => setSelectedWindow("recycleBin")}
              />
              <p id="taskbarText">Recycle Bin</p>
            </div>
          )}
          {openWindows.includes("profile") && (
            <div className="taskbar-item">
              <img id="taskImage"
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
              <img id="taskImage"
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
            selectedWindow === "myComputer" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("myComputer")}
          onDoubleClick={() => handleProgramDoubleClick("myComputer")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img id="iconImage" src={computer} />
          <p id="programName">My Computer</p>
        </div>
        <div
          className={`program ${
            selectedWindow === "recycleBin" ? "selected" : ""
          }`}
          onClick={() => handleProgramClick("recycleBin")}
          onDoubleClick={() => handleProgramDoubleClick("recycleBin")}
          onContextMenu={(e) => e.preventDefault()}
        >
          <img id="iconImage" src={trashbin} />
          <p id="programName">Recycle Bin</p>
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
              width: 60,
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
              width: 60,
              justifySelf: "center",
              marginBottom: "25px",
              marginTop: "20px",
            }}
          />
          <p id="programName">Command Prompt</p>
        </div>
      </div>

      {/* Start Menu */}
      <div className="startMenu"></div>

      {/* App Container */}
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

              <li onClick={() => handleMenuItemClick("new")}>New</li>
              <li onClick={() => handleMenuItemClick("undo move")}>
                Undo Move
              </li>
              <li onClick={() => handleMenuItemClick("paste")}>Paste</li>
              <li onClick={() => handleMenuItemClick("paste shortcut")}>
                Paste Shortcut
              </li>
              <li onClick={() => handleMenuItemClick("properties")}>
                Properties
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
