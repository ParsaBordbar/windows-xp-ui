import React, { useState } from "react";
import "./Explorer.css";
import myComputerIcon from "./img/computer.png";
import folderIcon from "./img/document.png";
import fileIcon from "./img/mp3.png";

const FileExplorer = () => {
  const [folders] = useState([
    { name: "Documents", icon: folderIcon },
    { name: "Pictures", icon: folderIcon },
  ]);

  const [files] = useState([
    { name: "File1.txt", icon: fileIcon },
    { name: "File2.doc", icon: fileIcon },
    { name: "File3.pdf", icon: fileIcon },
  ]);

  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: { clientX: number; clientY: number }) => {
    setDragging(true);
    setDragOffset({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    });
  };

  const handleMouseMove = (e: { clientX: number; clientY: number }) => {
    if (dragging) {
      setWindowPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = (e: { clientX: number; clientY: number }) => {
    setDragging(false);
    setWindowPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  return (
    <div
      className="explorer-window"
      style={{
        transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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
          <div className="folder-section">
            {folders.map((folder, index) => (
              <div className="folder-item" key={index}>
                <img src={folder.icon} alt="Folder" />
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
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
  );
};

export default FileExplorer;
