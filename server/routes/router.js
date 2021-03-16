// Author: Filip 'Filomaster' Majorek
// Description: This is main router file for all endpoints

const express = require("express");
const path = require("path");
const fs = require("fs");
const output = require("../library/utils").out;
const game = require("./game");
const images = require("./images");
const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/html/index.html"));
});

router.use("/game/", game);
router.use("/images/", images);

// Sending out all necessary files
router.get("/templates/:file", (req, res) => {
  res.type = "text/plain";
  res.sendFile(path.join(__dirname, "../../static/html/" + req.params.file));
});
router.get("/scripts/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/scripts/" + req.params.file));
});
router.get("/scripts/library/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/scripts/library/" + req.params.file));
});
router.get("/css/:file", (req, res) =>
  res.sendFile(path.join(__dirname, "../../static/css/" + req.params.file))
);

module.exports = router;
