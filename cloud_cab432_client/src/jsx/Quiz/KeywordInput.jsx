import React, { useState, useRef, useEffect } from "react";

function KeywordInput({ keywords, setKeywords, maxTags = 5 }) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "," && keywords.length < maxTags) {
      event.preventDefault();
      addKeyword(inputValue);
    } else if (
      event.key === "Backspace" &&
      inputValue === "" &&
      keywords.length
    ) {
      const lastKeyword = keywords[keywords.length - 1];
      setKeywords(keywords.slice(0, -1));
      setInputValue(lastKeyword);
    }
  };

  const addKeyword = (keyword) => {
    const newKeyword = keyword.trim();
    if (newKeyword && keywords.length < maxTags) {
      setKeywords([...keywords, newKeyword]);
      setInputValue("");
    }
  };

  const handleOutsideClick = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      addKeyword(inputValue);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [inputValue, keywords]);

  return (
    <div
      ref={containerRef}
      className="keyword-container"
      onClick={() => inputRef.current && inputRef.current.focus()}
    >
      {keywords.map((keyword, index) => (
        <span
          key={index}
          className="keyword-box"
          onClick={() => {
            const selectedKeyword = keywords[index];
            const newKeywords = [...keywords];
            newKeywords.splice(index, 1);
            setKeywords(newKeywords);
            setInputValue(selectedKeyword);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          {keyword}
        </span>
      ))}
      {keywords.length < maxTags && (
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={
            keywords.length > 0 ? "" : "Type keywords separated by a comma"
          }
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}

export default KeywordInput;
