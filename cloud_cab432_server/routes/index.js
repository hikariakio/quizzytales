var express = require("express");

var router = express.Router();
const multer = require("multer");
const { filesToKeywords,base64StringsToKeywords } = require("../Managers/CloudVisionManager");
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

router.post("/generate", async (req, res) => {
  const {
    images = [],
    addData = "",
    genre,
    resolution,
    language = "en",
  } = req.body;

  console.log("GENERAERETETEET");
  console.log(req.body.images);
  console.log(req.body.genre);
  console.log(req.body.resolution);

  if (images.length === 0) {
    return res.status(400).json({ error: "No images received" });
  }

  try {
    const allKeyWords = await base64StringsToKeywords(images);

    const storyObject = await generateStory(genre, resolution, [
      ...allKeyWords,
      ...addData.split(/\s*,\s*/),
    ]);

    const storyRes = storyObject.choices[0].message.content;

    const result = {
      genre,
      resolution,
      addData,
      keywords: allKeyWords,
      translations: {
        en: storyRes,
      },
    };

    if (language !== "en") {
      const transObject = await translateText(storyRes, language);
      result.translations[language] = transObject[0];
    }

    res.status(200).send(result);
  } catch (err) {
    console.error("Error during story generation:", err);
    res.status(500).send({
      error: "Image processing failed",
      detail: err.message,
    });
  }
});

router.post("/quiz", async (req, res) => {
  const { images = [], addData = "" } = req.body;

  if (images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  try {
    const allKeyWords = await base64StringsToKeywords(images);

    const quizData = await generateQuiz(allKeyWords, addData.split(/\s*,\s*/));

    const result = {
      keywords: allKeyWords,
      addData: addData,
      quiz: JSON.parse(quizData.choices[0].message.content),
    };

    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.error("Quiz generation failed:", err);
    res.status(500).json({ error: "Failed to generate quiz", detail: err.message });
  }
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
