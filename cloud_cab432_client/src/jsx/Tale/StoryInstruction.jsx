import React from "react";

function StoryInstruction() {
  return (
    <div className={"instruction-container"}>
      <div>
        <h2>Instruction</h2>
      </div>
      <div className={"left"}>
        <p>Click "Upload" and select your image(s). </p>
        <p>Use the settings panel to tweak your image.</p>
        <p>Pick your preferred language from the dropdown.</p>
        <p> Hit "Tell Me a Story" and wait a moment.</p>
      </div>
    </div>
  );
}
export default StoryInstruction;
