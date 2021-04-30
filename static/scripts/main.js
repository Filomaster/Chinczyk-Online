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

// ! Unified function to load game
let game = () => {
  conManager.loadPage(ConnectionManager.addresses.game, () => {
    import("./src/game.js").then((module) => {
      document.getElementById("dice").onclick = function () {
        module.rollDice(); // Add event
      };
    });
  });
};

// ! First after loading page, check if player already is in the room
fetch("/game/check", { method: "POST" }).then((res) => {
  if (res.status == 200) game();
});

conManager.loadPage(ConnectionManager.addresses.home, () => {
  console.log(document.getElementById("newGame"));
  // ! Add "NEW GAME" callback
  document.getElementById("newGame").addEventListener("click", () => {
    fetch("/game/create/", { method: "POST" }).then((res) => {
      switch (res.status) {
        case 200:
          game();
          break;
        case 403:
        case 404:
          engine.windowManager.show();
          break;
      }
      if (res.status == 200) game();
    });
  });
  // ! Add "JOIN GAME" callback
  document.getElementById("joinGame").addEventListener("click", () => {
    let joinMessage = new Window("Join room", {
      input: { name: "ROOM ID", min: 5, max: 6 },
    });
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
              engine.windowManager.clear(joinMessage);
              if (res.status == 200) game();
              else {
                res.text().then((message) => {
                  let msgWindow = new Window("ERROR", { message }, [
                    {
                      name: "ok",
                      callback: () => {
                        engine.windowManager.clear(msgWindow);
                      },
                    },
                  ]);
                  engine.windowManager.show(msgWindow);
                });
              }
            });
          }
        },
      },
    ];
    engine.windowManager.show(joinMessage);
  });
});

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
