if (process.env.IS_OFFLINE || process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const serverless = require("serverless-http");
const app = require("./app");

module.exports.handler = serverless(app);
