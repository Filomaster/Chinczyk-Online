// Author: Filip 'Filomaster' Majorek
// Description: This is main client-side script

"use strict";

import ConnectionManager from "./src/classes/ConnectionManager.js";
import Engine from "./src/classes/Engine.js";
import Window from "./src/classes/Window.js";
// import { setDice, rollDice } from "./game.js";

const pageContent = document.getElementById("content");
const engine = new Engine(document.getElementById("content"));
const conManager = new ConnectionManager(pageContent);

// ! First after loading page, check if player already is in the room
fetch("/game/check", { method: "POST" }).then((res) => {
  console.log(res.status);
});

// /*
conManager.loadPage(ConnectionManager.addresses.home, () => {
  console.log(document.getElementById("newGame"));
  // ! Add "NEW GAME" callback
  document.getElementById("newGame").addEventListener("click", () => {
    fetch("/game/create/", { method: "POST" }).then((res) => {
      console.log(res);
    });
  });
  // ! Add "JOIN GAME" callback
  document.getElementById("joinGame").addEventListener("click", () => {
    let joinMessage = new Window("Join room", { input: { name: "ROOM ID", min: 5, max: 6 } });
    joinMessage.buttons = [
      {
        name: "Close",
        callback: () => {
          engine.windowManager.clear(joinMessage);
        },
      },
      {
        name: "Join!",
        callback: () => {
          console.log(joinMessage.value);
          if (joinMessage.value) {
            let data = JSON.stringify({ roomId: joinMessage.value });
            console.log(data);
            // engine.windowManager.clear(loginWindow);
            fetch("/game/join/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: data,
            }).then((res) => {
              console.log(res);
            });
          }
        },
      },
    ];
    engine.windowManager.show(joinMessage);
  });
});

// */
/*
// Load game page
fetch("/game.html").then((res) => {
  res
    .text() // Convert received file to text
    .then((str) => (pageContent.innerHTML = str)) // Render converted file on the main page
    .then(() => {
      // Load client-side script for game
      import("./src/game.js").then((module) => {
        document.getElementById("test-btn").onclick = function () {
          module.testOrder(); // Add event
        };
        //   document.getElementById("dice").onclick = function () {
        //     module.rollDice(); // Add event
        //   };
      });
    });
});
*/
