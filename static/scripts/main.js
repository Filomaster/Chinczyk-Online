// Author: Filip 'Filomaster' Majorek
// Description: This is main client-side script
// import { setDice, rollDice } from "./game.js";
("use strict");

const pageContent = document.getElementById("content");

// Load game page
fetch("/templates/game.html").then((res) => {
  res
    .text() // Convert received file to text
    .then((str) => (pageContent.innerHTML = str)) // Render converted file on the main page
    .then(() => {
      // Load client-side script for game
      import("./library/game.js").then((module) => {
        document.getElementById("dice").onclick = function () {
          module.rollDice(); // Add event
        };
      });
    });
});
