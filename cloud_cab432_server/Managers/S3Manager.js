const aws = require("aws-sdk");
require("dotenv").config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "ap-southeast-2",
});

const s3 = new aws.S3();

const checkBucket = async (bucketName) => {
  try {
    await s3.createBucket({ Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
  } catch (err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
};

const createNewFile = async (bucketName, bucketFile) => {
  const params = {
    Bucket: bucketName,
    Key: bucketFile,
    Body: "1",
    ContentType: "text/plain",
  };
  try {
    await s3.headObject({ Bucket: bucketName, Key: bucketFile }).promise();
  } catch (err) {
    if (err.code === "NotFound") {
      try {
        await s3.putObject(params).promise();
        console.log("JSON file uploaded successfully.");
      } catch (err) {
        console.error("Error uploading JSON file:", err);
      }
    }
    throw err;
  }
};

const getAndUpdateViewCount = async (bucketName, bucketFile) => {
  const getObjParams = {
    Bucket: bucketName,
    Key: bucketFile,
  };

  let oldNumber = 0;

  try {
    const data = await s3.getObject(getObjParams).promise();
    const fileContent = data.Body.toString();
    oldNumber = parseInt(fileContent);
    const newNumber = oldNumber + 1;
    const updatedContent = newNumber.toString();

    const putObjectParams = {
      Bucket: bucketName,
      Key: bucketFile,
      Body: updatedContent,
    };

    await s3.putObject(putObjectParams).promise();

    return newNumber;
  } catch (err) {
    console.error(err);
    return oldNumber;
  }
};

module.exports.checkBucket = checkBucket;
module.exports.createNewFile = createNewFile;
module.exports.getAndUpdateViewCount = getAndUpdateViewCount;
