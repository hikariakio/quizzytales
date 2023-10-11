const vision = require("@google-cloud/vision");
require("dotenv").config();

const CONFIG = {
  credentials: {
    private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY, "base64").toString(
      "ascii",
    ),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
};
const client = new vision.ImageAnnotatorClient(CONFIG);

async function detectImageFromBuffer(imageBuffer) {
  const request = {
    image: { content: imageBuffer.toString("base64") },
    features: [{ type: "LANDMARK_DETECTION" }, { type: "LABEL_DETECTION" }],
  };

  let [result] = await client.annotateImage(request);
  return result;
}

async function filesToKeywords(files) {
  const results = [];
  for (const img of files) {
    const result = await detectImageFromBuffer(img.buffer);
    results.push(result);
  }

  const flattenedLabels = results.flatMap((item) =>
    item.labelAnnotations
      .filter((label) => label.score > 0.8)
      .map((label) => label.description),
  );
  const flattenedLandMarks = results.flatMap((item) =>
    item.landmarkAnnotations
      .filter((label) => label.score > 0.6)
      .map((label) => label.description),
  );

  return [...flattenedLabels, ...flattenedLandMarks];
}

module.exports.filesToKeywords = filesToKeywords;
