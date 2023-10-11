import React, { useState } from "react";
import axios from "axios";
import ImagePicker from "../Components/ImagePicker";
import MultipleChoiceQuiz from "./QuizForm";
import Grid from "@mui/material/Unstable_Grid2";
import { fetchConfig } from "../../utils/fetchConfig";
import QuizInstructions from "./QuizInstruction";
import LoadingScreen from "../Components/LoadingScreen";
import KeywordInput from "./KeywordInput";
import { generateLoadingQuiz } from "../../helper/helper";

function QuizMaker() {
  //----------------------------------- quiz

  const [quizData, setQuizData] = useState([]);
  const [quizLoadingText, setQuizLoadingText] = useState("");
  const [quizReady, setQuizReady] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const maxTags = 5;

  //----------------------------------------------------------

  const [selectedImages, setSelectedImages] = useState([]);
  const [quizFinish, setQuizFinish] = useState(false);
  const restart = () => {
    setSelectedImages([]);
    setQuizData([]);
    setKeywords([]);
    setQuizFinish(false);
    setQuizReady(false);
  };

  const generateQuiz = async () => {
    const backendURL = await fetchConfig();

    const formData = new FormData();

    if (selectedImages.length === 0) {
      alert("Need to upload photos.");
      return;
    }

    formData.append("addData", keywords.join(","));

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });
    setQuizLoadingText(generateLoadingQuiz("en"));
    try {
      await axios
        .post(`${backendURL}/quiz`, formData)
        .then((response) => {
          // Handle success
          console.log("Response data:", response.data);
          setQuizData(response.data);
          setQuizReady(true);
          setQuizLoadingText("");
          // You can access the response data using response.data
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
          setQuizLoadingText("");
        });

      // alert('Images uploaded successfully');
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  return (
    <>
      <Grid container>
        <Grid xs={12} md={6}>
          <div className={"main-left-container center"}>
            <ImagePicker
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              maxImageCount={1}
              ready={quizReady}
            />
            {!quizReady ? (
              <div className={"center"}>
                <div className="left setting-container">
                  <h3>Settings</h3>
                  <p>Additional Keywords</p>
                  <KeywordInput keywords={keywords} setKeywords={setKeywords} />
                  <div className={"right"}>
                    {keywords.length}/{maxTags}
                  </div>
                </div>
                <button className={"main-button"} onClick={generateQuiz}>
                  Generate Quiz
                </button>
              </div>
            ) : (
              <div className={"center"} style={{ marginTop: "30px" }}>
                <div className="left">
                  <h3>Result</h3>
                  <p>Extracted Keywords</p>
                  <div className="keyword-table-container">
                    {quizData["keywords"].map((word, index) => (
                      <div key={index} className="keyword-element">
                        • {word}
                      </div>
                    ))}
                  </div>
                  <br />
                  <p>Additional Keywords : {keywords.join(",")}</p>
                </div>
              </div>
            )}
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div style={{ padding: "10px", height: "100%" }}>
            <div className={"main-right-container"}>
              {quizReady && quizLoadingText === "" ? (
                <div className={"center"}>
                  <MultipleChoiceQuiz
                    quizData={quizData["quiz"]["questions"]}
                    quizFinish={quizFinish}
                    setQuizFinish={setQuizFinish}
                  />
                  {quizFinish && (
                    <button className={"main-button"} onClick={restart}>
                      Restart
                    </button>
                  )}
                </div>
              ) : (
                <QuizInstructions />
              )}
            </div>
          </div>
        </Grid>
      </Grid>
      {quizLoadingText !== "" && (
        <LoadingScreen loadingtext={quizLoadingText} />
      )}
    </>
  );
}

export default QuizMaker;
