const vision = require("@google-cloud/vision");
require("dotenv").config();

const CONFIG = {
  credentials: {
    private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY, "base64").toString(
      "ascii",
    ),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  fallback: true,
};
const client = new vision.ImageAnnotatorClient(CONFIG);

async function detectImageFromBuffer(imageBuffer) {
  const base64Image = imageBuffer.toString("base64");

  const request = {
    image: { content: base64Image },
    features: [
      { type: "LANDMARK_DETECTION" },
      { type: "LABEL_DETECTION" },
    ],
  };

  const [result] = await client.annotateImage(request);
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

async function base64StringsToKeywords(base64Images) {
  const results = [];

  for (const base64 of base64Images) {
    const buffer = Buffer.from(base64, "base64");
    const result = await detectImageFromBuffer(buffer);
    results.push(result);
  }

  const flattenedLabels = results.flatMap((item) =>
      item.labelAnnotations
          ?.filter((label) => label.score > 0.8)
          .map((label) => label.description) ?? []
  );

  const flattenedLandmarks = results.flatMap((item) =>
      item.landmarkAnnotations
          ?.filter((label) => label.score > 0.6)
          .map((label) => label.description) ?? []
  );

  return [...flattenedLabels, ...flattenedLandmarks];
}


module.exports.filesToKeywords = filesToKeywords;
module.exports.base64StringsToKeywords = base64StringsToKeywords;
