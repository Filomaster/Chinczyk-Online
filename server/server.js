// Author: Filip 'Filomaster' Majorek
// Description: This is main file of the server

// #region Imports
const express = require("express");
const session = require("express-session");
const nedb = require("nedb");
const nedbStore = require("nedb-session-store")(session);
const dotenv = require("dotenv").config();
// Custom files and modulesimport
const { out, colors } = require("./src/components/utils");
const UserManager = require("./src/classes/PlayerManager");
const router = require("./src/routes/router");
const path = require("path");
//#endregion

// Constants
const app = express();
const PORT = process.env.PORT || 3000;

// Creating session
app.use(
  session({
    secret: "oreWaHimitsuDesu",
    name: "_ludoOnline",
    saveUninitialized: true,
    resave: false,
    store: new nedbStore({
      filename: "./server/database/session.db",
      autoCompactInterval: 5000,
    }),
  })
);
app.use(express.static(path.join(__dirname, "../static/html")));
app.use(express.static(path.join(__dirname, "../static")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router); // Using router

// Executable code below
out.checkColors();

//? ---- TEST CODE ---

//? ---- END OF TEST CODE ----

// Starting server
app.listen(PORT, () => {
  out.printStatus(colors.blue, "SERVER", "INFO", `Started listening on port ${PORT}`);
});
