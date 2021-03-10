// Author: Filip 'Filomaster' Majorek
// Description: This is main file of Ludo server

const express = require("express");
const session = require("express-session");
const output = require("./library/utils").out;

const app = express();
const PORT = process.env.PORT || 3000;

// Starting server
app.listen(PORT, () => {
  output.info(`Started listening on port ${PORT}`);
});
