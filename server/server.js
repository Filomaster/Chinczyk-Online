// Author: Filip 'Filomaster' Majorek
// Description: This is main file of Ludo server

// Imports
const express = require("express");
const session = require("express-session");
const output = require("./library/utils").out;
const router = require("./routes/router");

// Constants
const app = express();
const PORT = process.env.PORT || 3000;

// Using router
app.use("/", router);

// Starting server
output.checkColors();
app.listen(PORT, () => {
  output.info(`Started listening on port ${PORT}`);
});
