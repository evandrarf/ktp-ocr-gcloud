// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
async function checkNik(fileName) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();
  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;
  const res = detections.find(
    (text) => text.description.length === 16 && !isNaN(text.description)
  );

  return res ? res.description : null;
}

module.exports = { checkNik };
