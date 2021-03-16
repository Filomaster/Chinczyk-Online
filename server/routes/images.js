// Author: Filip 'Filomaster' Majorek
// Description: This is router file for image endpoints

const express = require("express");
const path = require("path");
const fs = require("fs");
const output = require("../library/utils").out;
const router = express.Router();

router.get(":file", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/images/" + req.params.file));
});
router.get("/board/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/images/board/" + req.params.file));
});
router.get("/dice/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "../../static/images/dice/" + req.params.file));
});
module.exports = router;
