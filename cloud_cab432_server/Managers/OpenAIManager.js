var OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

function generateContent(theme, resolution) {
  system_content =
    "You are the best story teller with most vivid imagination." +
    `Use keywords from the user to create a story of a following theme,${theme} and a resolution of ${resolution}` +
    `You dont need to use all keywords. If there are Landmarks, use one of them.` +
    `Make a paragraph story around 200 words.`;
  return system_content;
}

async function generateStory(theme, resolution, keywords) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: generateContent(theme, resolution),
      },
      {
        role: "user",
        content: keywords.join(","),
      },
    ],

    model: "gpt-3.5-turbo",
  });
  return chatCompletion;
}

async function generateQuiz(keyword, addData) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are tasked with creating a quiz generator that produces 3 questions. If 'AdditionalData' is provided, create a quiz on that topic, but ensure it's closely related to the 'Keywords' from user inputs. If 'AdditionalData' is not present, you have the freedom to choose a topic solely based on the 'Keywords'. For the selected topic, formulate 3 multiple-choice questions, each with 4 options, and present these in JSON format. Ensure the questions are specific and not overly general, and that they all fall under the same topic. In the JSON format, 'questions' should be an array, and the key values for each question should be 'question', 'options', and 'correct_answer'.",
      },
      {
        role: "user",
        content: `Keywords : ${keyword.join(
          ",",
        )}\n AdditionalData : ${addData.join(",")}`,
      },
    ],

    model: "gpt-3.5-turbo",
  });
  return chatCompletion;
}

module.exports.generateStory = generateStory;
module.exports.generateQuiz = generateQuiz;
