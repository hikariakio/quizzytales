import React, { useState } from "react";
import axios from "axios";
import Dropdown from "../Components/DropDown";
import Typewriter from "./TypeWriter";
import ImagePicker from "../Components/ImagePicker";

import Grid from "@mui/material/Unstable_Grid2";

import { generateLoadingStory, generateSpaces } from "../../helper/helper";
import { fetchConfig } from "../../utils/fetchConfig";
import LoadingScreen from "../Components/LoadingScreen";
import StoryInstruction from "./StoryInstruction";
import KeywordInput from "../Quiz/KeywordInput";

function StoryTeller() {
  const [selectedImages, setSelectedImages] = useState([]);
  const generateStory = async () => {
    const backendURL = await fetchConfig();

    const formData = new FormData();

    if (selectedGenre == null || selectedGenre === "") {
      alert(`Choose a story's genre`);
      return;
    }

    if (selectedRes == null || selectedRes === "") {
      alert(`Choose a story's resolution`);
      return;
    }

    formData.append("addData", keywords.join(","));
    formData.append("genre", selectedGenre.toString());
    formData.append("language", selectedLanguage.toString());
    formData.append("resolution", selectedRes.toString());

    if (selectedImages.length === 0) {
      alert("At least upload 1 image");
      return;
    }

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    setStoryLoadingText(generateLoadingStory("en")); //todo: add more languages

    setStoryReady(false);

    try {
      await axios
        .post(`${backendURL}/generate`, formData)
        .then((response) => {
          // Handle success
          console.log("Response data:", response.data);
          setStoryData(response.data);
          setShowStory(response.data["translations"][selectedLanguage]);
          setStoryLoadingText("");
          setStoryReady(true);
          setPrevLanguage(selectedLanguage);

          // You can access the response data using response.data
        })
        .catch((error) => {
          // Handle error
          setStoryLoadingText("");
          console.error("Error:", error);
        });

      // alert('Images uploaded successfully');
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  const translateText = async () => {
    const backendURL = await fetchConfig();
    setPrevLanguage(selectedLanguage);

    if (selectedLanguage in storyData["translations"]) {
      setShowStory(storyData["translations"][selectedLanguage]);

      return;
    }

    const formData = new FormData();
    formData.append("language", selectedLanguage);
    setStoryLoadingText(generateLoadingStory("en")); //todo: add more languages

    try {
      await axios
        .post(`${backendURL}/translate`, {
          target: selectedLanguage,
          text: storyData["translations"]["en"],
        })
        .then((response) => {
          console.log("Response data:", response.data);
          addLanguageToInner(selectedLanguage, response.data);
          setShowStory(response.data);
          setStoryLoadingText("");

          // You can access the response data using response.data
        })
        .catch((error) => {
          // Handle error
          setStoryLoadingText("");
          console.error("Error:", error);
        });

      // alert('Images uploaded successfully');
    } catch (error) {
      console.error("Error uploading images", error);
    }
  };

  const resetEverything = () => {
    setStoryReady(false);
    setSelectedImages([]);
    setKeywords([]);
    console.log("this is a reset button");
  };

  //--------------------------------- DROPDOWNS (GENRE)

  const [selectedGenre, setSelectedGenre] = useState("");
  const handleGenreOptionChange = (newOption) => {
    setSelectedGenre(newOption);
  };

  const genreOptions = [
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Horror", label: "Horror" },
    { value: "Adventure", label: "Adventure" },
    { value: "Random", label: "Random" },
  ];

  //--------------------------------- DROPDOWNS (Res)

  const [selectedRes, setSelectedRes] = useState("");
  const handleResOptionChange = (newOption) => {
    setSelectedRes(newOption);
  };

  const resOptions = [
    { value: "Happy", label: "Happy" },
    { value: "Sad", label: "Sad" },
    { value: "Ambiguous", label: "Ambiguous" },
    { value: "Bittersweet", label: "Bittersweet" },
    { value: "Twist", label: "Twist" },
    { value: "Random", label: "Random" },
  ];

  //--------------------------------- DROPDOWNS (Language)

  const [prevLanguage, setPrevLanguage] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const handleLanguageOptionChange = (newOption) => {
    setSelectedLanguage(newOption);
  };

  const langOptions = [
    { value: "en", label: "English" },
    { value: "my", label: "Myanmar(Burmese)" },
    { value: "zh-CN", label: "Chinese(Simplified)" },
    { value: "zh-TW", label: "Chinese(Traditional)" },
    { value: "ja", label: "Japanese" },
    { value: "es", label: "Spanish" },
  ];

  const getLanguage = (value) => {
    const selectedOption = langOptions.find((option) => option.value === value);
    return selectedOption ? selectedOption.label : "Label not found";
  };

  //----------------------------------- Story

  const [storyData, setStoryData] = useState();

  const addLanguageToInner = (target, text) => {
    setStoryData((prevState) => {
      return {
        ...prevState,
        translations: {
          ...prevState["translations"],
          [target]: text,
        },
      };
    });
  };

  const [showStory, setShowStory] = useState("");
  const [storyLoadingText, setStoryLoadingText] = useState(""); // to show loading indicator
  const [storyReady, setStoryReady] = useState(false); // flag to show story
  const [keywords, setKeywords] = useState([]);
  const maxTags = 3;
  return (
    <>
      <Grid container>
        <Grid xs={12} md={6}>
          <div className={"main-left-container"}>
            <ImagePicker
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              maxImageCount={3}
              ready={storyReady}
            />
            {!storyReady ? ( // WHEN STORY IS NOT READY
              <div className={"center"}>
                <div className="left setting-container">
                  <h3>Settings</h3>
                  <Dropdown
                    dropDownTitle={"GENRE " + generateSpaces(10) + ":\u00A0"}
                    options={genreOptions}
                    selectedOption={selectedGenre}
                    onOptionChange={handleGenreOptionChange}
                    nullable={true}
                  />
                  <Dropdown
                    dropDownTitle={"RESOLUTION :\u00A0"}
                    options={resOptions}
                    selectedOption={selectedRes}
                    onOptionChange={handleResOptionChange}
                    nullable={true}
                  />
                  <p>Additional Keywords</p>
                  <KeywordInput keywords={keywords} setKeywords={setKeywords} />
                  <div className={"right"}>
                    {keywords.length}/{maxTags}
                  </div>
                  <Dropdown
                    dropDownTitle={"LANGUAGE " + generateSpaces(3) + ":\u00A0"}
                    options={langOptions}
                    selectedOption={selectedLanguage}
                    onOptionChange={handleLanguageOptionChange}
                  />
                </div>
                <button className={"main-button"} onClick={generateStory}>
                  Generate Story
                </button>
              </div>
            ) : (
              //   WHEN STORY IS READY
              <div className={"center"} style={{ marginTop: "30px" }}>
                <div className="left">
                  <h3>Result</h3>
                  <p>Extracted Keywords</p>
                  <div className="keyword-table-container">
                    {storyData["keywords"].map((word, index) => (
                      <div key={index} className="keyword-element">
                        • {word}
                      </div>
                    ))}
                  </div>
                  <br />

                  <h6>Selected Genre : {selectedGenre}</h6>
                  <h6>Selected Resolution : {selectedRes}</h6>
                  <p>Additional Keywords : {keywords.join(",")}</p>
                </div>

                <button className={"main-button"} onClick={resetEverything}>
                  Restart
                </button>

                <div className="left">
                  <h5>Languages</h5>
                  <div> Current Language : {getLanguage(prevLanguage)}</div>
                  <Dropdown
                    dropDownTitle={"New Language :\u00A0"}
                    options={langOptions}
                    selectedOption={selectedLanguage}
                    onOptionChange={handleLanguageOptionChange}
                  />
                </div>
                <button className={"main-button"} onClick={translateText}>
                  Translate
                </button>
              </div>
            )}
          </div>
        </Grid>
        <Grid xs={12} md={6}>
          <div style={{ padding: "10px", height: "100%" }}>
            <div className={"main-right-container"}>
              {storyReady && storyLoadingText === "" ? (
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    placeItems: "center",
                    lineHeight: "1.8",
                  }}
                  className={"left"}
                >
                  <Typewriter text={showStory} speed={10} />
                </div>
              ) : (
                <StoryInstruction />
              )}
            </div>
          </div>
        </Grid>
      </Grid>
      {storyLoadingText !== "" && (
        <LoadingScreen loadingtext={storyLoadingText} />
      )}
    </>
  );
}

export default StoryTeller;
