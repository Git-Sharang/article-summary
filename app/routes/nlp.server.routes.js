module.exports = function (app) {
  var nlpController= require("../controllers/nlp.server.controller");

  app.route("/")
      .get(nlpController.renderURLForm);

  app.route("/processNLP")
    .get(nlpController.scrapeURL, nlpController.processText, nlpController.renderResult);

  app.route("/api/run")
      .post(nlpController.run, nlpController.processText, nlpController.renderResultJson);

};
