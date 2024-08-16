import React, { useState } from "react";
import "./Notepad.css";
import { initial } from "./App";
const Notepad = () => {
  const [text, setText] = useState(initial);
  const [line, setLine] = useState(1);
  const [column, setColumn] = useState(1);

  const handleChange = (event: {
    target: { value: any; selectionStart: any };
  }) => {
    const newText = event.target.value;
    setText(newText);

    // Calculate line and column number
    const lines = newText.substr(0, event.target.selectionStart).split("\n");
    setLine(lines.length);
    setColumn(lines[lines.length - 1].length + 1);
  };

  return (
    <div className="notepad-container">
      <div className="menu-bar">
        <div className="menu-item">File</div>
        <div className="menu-item">Edit</div>
        <div className="menu-item">Format</div>
        <div className="menu-item">View</div>
        <div className="menu-item">Help</div>
      </div>
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={handleChange}
        placeholder="Start typing..."
      />
      <div className="status-bar">
        Line: {line}, Column: {column}
      </div>
    </div>
  );
};

export default Notepad;
