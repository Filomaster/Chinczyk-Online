// Author: Filip 'Filomaster' Majorek
// Description: Utils is my private library, used to format server logs

const color = require("supports-color");

// States
let OUT_LVL = 0;
let PRETTY_LENGTH = 20;
let COLOR = false;

// Formating methods
let formatTime = (time) => (time < 10 ? "0" + time : time);
let formattedMessage = (character, color = "") => {
  let time = new Date();
  let out =
    (COLOR ? color : "") +
    formatTime(time.getHours()) +
    ":" +
    formatTime(time.getMinutes()) +
    ":" +
    formatTime(time.getSeconds()) +
    ` [${character}]` +
    "  -  ";
  return out;
};
let parseArguments = (args) => {
  out = "";
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] == "object") {
      let string = JSON.stringify(args[i]);
      string = string.length > PRETTY_LENGTH ? JSON.stringify(args[i], null, 2) : string;
      out += "\n" + string + ", ";
    } else out += args[i] + (args.length > 1 ? ", " : " ");
  }
  return out;
};

// Main module
module.exports = {
  out: {
    /**
     * This method prints provided arguments as debug level message
     * @param  {...any} message - Any provided arguments
     */
    debug: (...message) => {
      if (OUT_LVL <= 0)
        console.log(formattedMessage("DEBUG", "\x1b[37m") + parseArguments(message));
    },
    /**
     * This method prints provided arguments as info level message
     * @param  {...any} message - Any provided arguments
     */
    info: (...message) => {
      if (OUT_LVL <= 1)
        console.log(
          formattedMessage("INFO", "\x1b[34m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
        );
    },
    /**
     * This method prints provided arguments as warning level message
     * @param  {...any} message - Any provided arguments
     */
    warn: (...message) => {
      if (OUT_LVL <= 2)
        console.log(
          formattedMessage("WARN", "\x1b[33m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
        );
    },
    /**
     * This method prints provided arguments as error level message
     * @param  {...any} message - Any provided arguments
     */
    error: (...message) => {
      if (OUT_LVL <= 3)
        console.log(
          formattedMessage("ERROR", "\x1b[31m") + parseArguments(message) + (COLOR ? "\x1b[0m" : "")
        );
    },
    /**
     * This method clear previous line
     */
    clearLastLine: () => {
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(1);
    },
    /**
     * This method clear current line
     */
    clearCurrentLine: () => {
      process.stdout.clearLine(-1);
      process.stdout.cursorTo(0);
    },
    /**
     * This method sets log level
     * @param {*} level
     * 0 - debug |
     * 1 - info |
     * 2 - warn |
     * 3 - error
     */
    setOutputLevel: (level) => (OUT_LVL = level),
    checkColors: () => {
      if (color.stdout) {
        COLOR = true;
      }
    },
  },
};
