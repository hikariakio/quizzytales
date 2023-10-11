import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";

function MultipleChoiceQuiz({ quizData, quizFinish, setQuizFinish }) {
  const [correctCount, setCorrectCount] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    setQuizFinish(false);
    setSelectedAnswers([]);
  }, [quizData]);

  const handleOptionChange = (e, questionIndex) => {
    if (quizFinish) return;
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = e.target.value;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sans", selectedAnswers);
    // You can add your logic to grade the quiz here based on selectedAnswers
    if (selectedAnswers.length !== quizData.length) {
      alert("Please answer all questions.");
    } else {
      const answers = quizData.map((q) => q["correct_answer"]);

      const boolList = answers.map(
        (element, index) => element === selectedAnswers[index],
      );

      //boolean
      const isAllCorrect = boolList.every((value) => value === true);

      setQuizFinish(true);
      const correctCount = boolList.filter((value) => value === true).length;
      setCorrectCount(correctCount);
    }
  };

  return (
    <div>
      <h4>Multiple Choice Quiz</h4>
      <form onSubmit={handleSubmit}>
        {quizData.map((questionData, index) => (
          <div className={"quiz-container"} key={index}>
            <p>
              {index + 1}. {questionData["question"]}
            </p>
            <Grid container>
              {questionData.options.map((option, optionIndex) => (
                <Grid sm={6}>
                  <label
                    key={optionIndex}
                    className={`option-label ${
                      (option === questionData["correct_answer"]) &
                        quizFinish && `option-label-correct`
                    }`}
                    onClick={() =>
                      handleOptionChange({ target: { value: option } }, index)
                    }
                  >
                    <span className="option-text">{option}</span>
                    <span className="checkbox-input">
                      <input
                        type="checkbox"
                        name={`question-${index}`}
                        value={option}
                        checked={selectedAnswers[index] === option}
                        onChange={() => {}}
                      />
                    </span>
                  </label>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
        <div className={"center"}>
          {!quizFinish ? (
            <button className={"main-button"} type="submit">
              Lock My Answers
            </button>
          ) : (
            <div>
              <p>
                ** You are correct {correctCount} out of {quizData.length}. **
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default MultipleChoiceQuiz;
