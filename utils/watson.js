var NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1.js");

var nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: "",
  version: "2018-04-05",
  url: "https://gateway.watsonplatform.net/natural-language-understanding/api/"
});

function getSentiment(text) {
  return nlu.analyze({
    text,
    features: {
      sentiment: {}
    }
  });
}

module.exports = {
  getSentiment
};
