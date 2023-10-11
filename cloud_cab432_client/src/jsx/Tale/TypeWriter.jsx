import React, { useState, useEffect } from "react";

const Typewriter = ({ text, speed }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, speed, text]);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayText("");
  }, [text]);
  return <div style={{ textAlign: "left" }}>{displayText}</div>;
};

export default Typewriter;
