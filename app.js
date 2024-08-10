const express = require("express");
const morgan = require("morgan");
const path = require("path");
const index = require("./routes");
const errorHandler = require("errorhandler");
require("./database");

const app = express();
module.exports = app;
app.use((req, res, next) => {
  const imagePath = path.join(__dirname, 'public', 'images', 'enconstruction.jpg');
  res.sendFile(imagePath);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

require("./config/session.config");
require("./config/passport.config");

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(index);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message,
    });
  });
}


