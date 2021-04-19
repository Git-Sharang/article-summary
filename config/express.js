const config = require("./config");
const express = require("express");
const morgan = require("morgan");
const compress = require("compression");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const cors = require("cors");

module.exports = function () {
  const app = express();

  // Use morgan for dev, compress for prod
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  } else if (process.env.NODE_ENV === "production") {
    app.use(compress());
  }

  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cors());

  app.set("views", "./app/views");
  app.set("view engine", "ejs");
  app.engine("html", require("ejs").renderFile);

  app.use(flash());

  require("../app/routes/nlp.server.routes.js")(app);

  app.use(express.static("./public"));
  // Virtual path for bootstrap css
  app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

  return app;
};
