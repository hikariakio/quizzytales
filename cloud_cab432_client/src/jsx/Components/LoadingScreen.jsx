// LoadingScreen.js
import React from "react";
import { FaSpinner } from "react-icons/fa";
import { generateSpaces } from "./helper";

function LoadingScreen({ loadingtext }) {
  return (
    <div
      style={{
        position: "fixed", // This will make sure it's on top of everything
        top: 0, // Start from the top
        left: 0, // Start from the left
        width: "100%", // Cover the full viewport width
        height: "100vh", // Cover the full viewport height
        zIndex: 1000, // High zIndex to ensure it's on top of other elements
        backgroundColor: "rgba(56,56,56,0.8)", // Optional: You can add a background color with some opacity
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgb(255,255,255)",
          border: "10px outset black",
          borderRadius: "25px",
          width: "80%",
          height: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className={"center"}
      >
        <h2>
          <FaSpinner className="icon-spin" /> {generateSpaces(5)}
          {loadingtext}...
        </h2>
      </div>
    </div>
  );
}

export default LoadingScreen;
