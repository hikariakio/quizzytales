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

    if (selectedImages.length === 0) {
      alert("Need to upload photos.");
      return;
    }

    // Convert files to base64
    const convertFilesToBase64 = async (files) => {
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.replace(/^data:image\/\w+;base64,/, "");
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      return Promise.all(promises);
    };

    const base64Images = await convertFilesToBase64(selectedImages);

    const payload = {
      images: base64Images,
      addData: keywords.join(","),
    };

    setQuizLoadingText(generateLoadingQuiz("en"));
    setQuizReady(false);

    try {
      const response = await axios.post(`${backendURL}/quiz`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response data:", response.data);
      setQuizData(response.data);
      setQuizReady(true);
      setQuizLoadingText("");
    } catch (error) {
      console.error("Error:", error);
      setQuizLoadingText("");
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
