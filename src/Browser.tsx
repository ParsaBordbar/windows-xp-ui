import React, { useState } from "react";
import "./Browser.css";
import { searchUrl } from "./img";

const bookmarks = [
  { name: "Digikala", url: "https://www.digikala.com" },
  { name: "OpenAI", url: "https://www.openai.com" },
  { name: "MehdiTohidi", url: "https://mehditohidi.com" },
];

const Browser: React.FC = () => {
  const [url, setUrl] = useState("https://www.digikala.com");
  const [iframeUrl, setIframeUrl] = useState("https://www.digikala.com");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      loadUrl();
    }
  };

  const loadUrl = () => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = "http://" + url;
    }
    setIframeUrl(formattedUrl);
  };

  const loadBookmark = (bookmarkUrl: string) => {
    setUrl(bookmarkUrl);
    setIframeUrl(bookmarkUrl);
  };

  return (
    <div className="browser">
      <div className="browser-header">
        <input
          id="inputUrl"
          type="text"
          className="browser-url"
          placeholder="Enter a URL"
          value={url}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
        <button id="goUrl" onClick={loadUrl}>
          <img id="goImage" src={searchUrl} alt="" />
        </button>
      </div>
      <div className="browser-bookmarks">
        {bookmarks.map((bookmark, index) => (
          <button
            key={index}
            className="bookmark-button"
            onClick={() => loadBookmark(bookmark.url)}
          >
            {bookmark.name}
          </button>
        ))}
      </div>
      <div className="browser-content">
        <iframe title="browser" src={iframeUrl} frameBorder="0"></iframe>
      </div>
    </div>
  );
};

export default Browser;
