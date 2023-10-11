const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

const CONFIG = {
  credentials: {
    private_key: Buffer.from(process.env.GOOGLE_PRIVATE_KEY, "base64").toString(
      "ascii",
    ),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
};

const translate = new Translate(CONFIG);

async function translateText(transText, target) {
  return await translate.translate(transText, target);
}

module.exports.translateText = translateText;
