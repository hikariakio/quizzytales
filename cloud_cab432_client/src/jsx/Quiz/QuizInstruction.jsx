import React from "react";

function QuizInstructions() {
  return (
    <div className={"instruction-container"}>
      <div>
        <h2>Instruction</h2>
      </div>
      <div className={"left"}>
        <p>Click "Upload" and select your image. </p>
        <p>Add your additional keyword if you want.</p>
        <p> Hit "Generate Quiz" and wait a moment.</p>
      </div>
    </div>
  );
}
export default QuizInstructions;
