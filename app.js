const path = require("path");
const express = require("express");
const morgan = require("morgan");
require("./database");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const errorHandler = require("errorhandler");
const csrf = require("csurf");
require("dotenv").config();
const { extractUserFromToken, addJwtFeatures } = require("./config/jwt.config"); // Importer les fonctions
const formationRoutes = require("./routes/formation.routes");
const contentRoutes = require("./routes/content.routes");

const app = express(); // Crée l'application Express
const io = require("socket.io")();
app.set("io", io);

// Configuration des middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Middleware pour passer le token CSRF à toutes les vues
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

require("./config/passport.config");
require("./config/jwt.config"); // Passe app à la configuration JWT
app.use(extractUserFromToken);
app.use(addJwtFeatures);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("short"));
app.use("/css", express.static(path.join(__dirname, "public/css")));

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

app.use(express.static(path.join(__dirname, "public/javascripts")));

app.use("/formations", formationRoutes);

app.use("/api/content", contentRoutes);

app.use(router);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Une erreur est survenue",
      error: process.env.NODE_ENV === "development" ? err.message : {},
    });
  });
}

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    message: "Route non trouvée",
  });
});

module.exports = app; // Exporte l'application
