const axios = require("axios");
const cheerio = require("cheerio");
const compromise = require("compromise");
const natural = require("natural");
const _ = require("lodash");

exports.renderURLForm = (req, res) => {
  res.render("urlForm");
};

exports.run = async (req, res, next) => {
  console.log('body', req.body);
  const url = req.body.summarizeURL; 
  const numSentence = req.body.numSentences; 
  const sentences = [];
  req.query.numSentence = numSentence;

  try {
    var htmlContent = await axios.get(url);
    var result = cheerio.load(htmlContent.data);

    result("p").each((index, element) => {
      compromise(result(element).text())
        .sentences()
        .out("array")
        .forEach((sentence) => {
          sentences.push(sentence);
        });
    });
    req.sentences = sentences;
    next();
  } catch (error) {
    res.status(500).send({
      error: "Unable to generate sentences"
    });
  }
};
exports.scrapeURL = async (req, res, next) => {
  const sentences = [];

  try {
    var htmlContent = await axios.get(req.query.summarizeURL);
    var result = cheerio.load(htmlContent.data);
    result("p").each((index, element) => {
      compromise(result(element).text())
        .sentences()
        .out("array")
        .forEach((sentence) => {
          sentences.push(sentence);
        });
    });
    req.sentences = sentences;
    next();
  } catch (error) {
    res.render("urlForm", {
      error: "Unable to access website URL - Try a different website.",
    });
  }
};

exports.processText = (req, res, next) => {
  req.payload = summarizeSentences(req.sentences, req.query.numSentence);
  next();
};

exports.renderResult = (req, res) => {
  res.render("results", { payload: req.payload });
};

exports.renderResultJson = (req, res) => {
  return res.json(req.payload);
};

const stemAndTokenize = (text) => {
  let tokens = new natural.WordTokenizer().tokenize(text);
  return tokens.map((token) => natural.PorterStemmer.stem(token));
};

const summarizeSentences = (sentences, numOfSentences) => {
  const db = new natural.TfIdf();
  const scoresMap = {};
  sentences.forEach((sentence) => {
    db.addDocument(stemAndTokenize(sentence));
  });
  sentences.forEach((sentence) => {
    stemAndTokenize(sentence).forEach((token) => {
      db.tfidfs(token, (id, measure) => {
        if (!scoresMap[id]) {
          scoresMap[id] = { id, score: 0 };
        }
        scoresMap[id].score += measure;
      });
    });
  });

  let scoresArray = _.values(scoresMap);

  scoresArray.sort((a, b) => (a.score < b.score ? 1 : -1));

  scoresArray = scoresArray.slice(0, numOfSentences);

  scoresArray.sort((a, b) => (a.id < b.id ? -1 : 1));

  return scoresArray.map((item) => sentences[item.id]);
};
