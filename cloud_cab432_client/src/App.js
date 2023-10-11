import logo from "./logo.svg";

import "./App.css";

import "./style/style.css";
import "./style/animate.css";

import StoryTeller from "./jsx/Tale/StoryTeller";
import { useState } from "react";
import QuizMaker from "./jsx/Quiz/QuizMaker";
import Footer from "./jsx/Footer";
import Header from "./jsx/Header";

function App() {
  const [mode, setMode] = useState("story");

  return (
    <>
      <Header setMode={setMode} />
      <div>{mode === "story" ? <StoryTeller /> : <QuizMaker />}</div>
      <Footer />
    </>
  );
}

export default App;
