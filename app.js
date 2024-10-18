const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("./database");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
require("dotenv").config();


const app = express();

exports.app = app;
/*app.use((req, res, next) => {
  const imagePath = path.join(__dirname, 'public', 'images', 'enconstruction.jpg');
  res.sendFile(imagePath);
});*/

app.use(cookieParser());

require("./config/jwt.config");



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("short"));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  })
);
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  })
);
app.use( express.static(path.join(__dirname, 'public/javascripts')));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); /*?????{ extended: true }*/

app.use(router);

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

module.exports = app; 