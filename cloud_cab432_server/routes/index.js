var express = require("express");

var router = express.Router();
const multer = require("multer");
const { filesToKeywords } = require("../Managers/CloudVisionManager");
const { generateStory, generateQuiz } = require("../Managers/OpenAIManager");
const { translateText } = require("../Managers/CloudTranslateManager");
const {
  checkBucket,
  createNewFile,
  getAndUpdateViewCount,
} = require("../Managers/S3Manager");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const storage = multer.memoryStorage(); // Store images in memory for this example
const upload = multer({ storage });

router.post("/generate", upload.array("images"), async (req, res, next) => {
  // console.log(req.files); // This will contain the uploaded images

  const addData = req.body.addData;
  const genre = req.body.genre;
  const resolution = req.body.resolution;

  const language = req.body.language;

  const allKeyWords = await filesToKeywords(req.files);

  const storyObject = await generateStory(genre, resolution, [
    ...allKeyWords,
    ...addData.split(/\s*,\s*/),
  ]);

  const storyRes = storyObject.choices[0].message.content;

  const result = {};
  result.genre = genre;
  result.resolution = resolution;
  result.addData = addData;
  result.keywords = allKeyWords;
  result.translations = {};

  result.translations["en"] = storyRes;

  if (language !== "en") {
    const transObject = await translateText(storyRes, language);
    result.translations[language] = transObject[0];
  }

  res.status(200).send(result);
});

router.post("/quiz", upload.array("images"), async (req, res, next) => {
  const addData = req.body.addData;
  const allKeyWords = await filesToKeywords(req.files);
  const quizData = await generateQuiz(allKeyWords, addData.split(/\s*,\s*/));

  const result = {};
  result.keywords = allKeyWords;
  result.addData = addData;
  result.quiz = JSON.parse(quizData.choices[0].message.content);
  console.log(result);
  res.status(200).send(result);
});

router.post("/translate", async (req, res, next) => {
  const transObject = await translateText(req.body.text, req.body.target);
  res.status(200).send(transObject[0]);
});

router.get("/viewcount", async (req, res, next) => {
  const bucketName = "yginnovatory.com";
  const bucketFile = "view.txt";
  try {
    await checkBucket(bucketName);
    await createNewFile(bucketName, bucketFile);
    const oldNumber = await getAndUpdateViewCount(bucketName, bucketFile);

    res.setHeader("Content-Type", "text/plain");
    console.log(oldNumber);
    res.send(`${oldNumber}`);
  } catch (error) {
    console.error("Error encountered:", error);
  }
});

module.exports = router;
