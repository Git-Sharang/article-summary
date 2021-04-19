process.env.NODE_ENV = process.env.NODE_ENV || "development";

const configureExpress = require("./config/express");

const app = configureExpress();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port);

console.log(`Server running on port ${port}.`);
module.exports = app;
