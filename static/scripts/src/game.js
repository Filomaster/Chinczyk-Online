// Author: Filip 'Filomaster' Majorek
// Description: This is client-side game script
"use strict";

import Engine from "./classes/Engine.js";
import Window from "./classes/Window.js";
// const synth = window.speechSynthesis;
let engine = new Engine(document.getElementById("game-container"));

let loginWindow = new Window(
  "Set username",
  {
    input: { name: "username", min: 1, max: 20 },
  },
  [
    {
      name: "Continue",
      callback: () => {
        if (loginWindow.value) {
          console.log(loginWindow.value);
          fetch("/rooms/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: loginWindow.value }),
          }).then(() => {
            engine.gameBoard.update();
            engine.windowManager.clear(loginWindow);
            fetch("/game/id/").then((res) =>
              res.text().then((text) => {
                let data = JSON.parse(text);
                console.log("KURNA JSON", data);
                let joinWindow = new Window(
                  "Ask your friends!",
                  {
                    message: `You've created room #${data.id}! Give this number to your friends, or send them this link: https://filo-ludo-online.herokuapp.com/game/join/${data.id}`,
                  },
                  [
                    {
                      name: "ok",
                      callback: () => {
                        engine.windowManager.clear(joinWindow);
                      },
                    },
                  ]
                );
                engine.windowManager.show(joinWindow);
              })
            );
          });
        }
      },
    },
  ]
);
console.log(
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("color"))
    .match(/(?==(.*)$)/)[1]
);
// console.log(!document.cookie.split("; ").find((row) => row.startsWith("name")));
if (!document.cookie.split("; ").find((row) => row.startsWith("name")))
  engine.windowManager.show(loginWindow);
engine.gameBoard.update();
// fetch("game/state/", { method: "POST" }).then((res) => {});

let playerPanel = document.getElementById("player-panel");
//! CHANGING ORDER OF PLAYER LIST !!!!!!!!!!!!!!!!!!!!!!
let testOrder = () => {
  // let children = Array.from(playerPanel.children).sort((a, b) => a.style.order - b.style.order);
  for (let i = 0; i < playerPanel.children.length; i++) {
    let current = playerPanel.children[i].style.order;
    playerPanel.children[i].style.order = parseInt(current) + 1;
    if (parseInt(playerPanel.children[i].style.order) == playerPanel.children.length + 1)
      playerPanel.children[i].style.order = 1;
  }
  console.log("-----------------------");
};

const board = document.getElementById("board");
// let divs = [];

for (let i = 0; i < 169; i++) {
  let field = document.createElement("DIV");
  field.dataset.num = i;
  board.appendChild(field);
}

import POSITIONS from "./data.js";

let counter = 0;
// let testInterval = setInterval(() => {
//   for (let j = 0; j < 169; j++) {
//     if (board.childNodes[j].dataset.num == POSITIONS[counter])
//       board.childNodes[j].style = "background-color: red";
//   }

//   counter++;
//   if (counter >= POSITIONS.length) counter = 0;
// }, 500);

function startGame() {
  fetch("/game/start/", { method: "POST" }).then(() => {
    engine.gameBoard.update();
  });
}
function rollDice() {
  // !FETCH
  fetch("/game/dice/", { method: "POST" }).then((res) =>
    res.text().then((parsed) => {
      let dice = JSON.parse(parsed).dice;

      let counter = 10;
      new Promise((res, rej) => {
        let x = setInterval(() => {
          let fake = Math.floor(Math.random() * 6 + 1);
          document.getElementById("new-dice").className = "num-" + fake;
          counter--;

          if (counter == 0) {
            clearInterval(x);
            res();
          }
        }, 50);
      }).then(() => {
        document.getElementById("new-dice").className = "num-" + dice;
        engine.gameBoard.update(JSON.parse(parsed).moves);
      });

      // for (var i = 1; i <= 6; i++) {
      //   document.getElementById("dice").classList.remove("show-" + i);
      //   if (dice === i) {
      //     document.getElementById("dice").classList.add("show-" + i);
      //   }
      // }
    })
  );
  // var dice = Math.floor(Math.random() * 6 + 1);
}

//!! EVENTS TEST CODE HERE !!

if (!!window.EventSource) {
  console.log("EVENTS HERE");
  const source = new EventSource("/events");

  source.addEventListener(
    "open",
    function (e) {
      console.log("Connection with server was open");
    },
    false
  );
  source.addEventListener(
    "message",
    function (e) {
      console.log(e.data, e.data == "update", typeof e.data, e.data.trim() == "update");
      if (e.data == "update") engine.gameBoard.update();
      // console.log(e.data);
    },
    false
  );
  source.addEventListener(
    "error",
    function (e) {
      if (e.readyState == EventSource.CLOSED) console.log("Connection was closed");
    },
    false
  );
}

// !!! ACTUAL NEW CODE HERE !!!

/* 
  Po wczytaniu się pokoju (czyli zakładamy, że gracz już dołączył do jednego)
  pokazuje się okienko z prośbą o wybranie nicku, następnie powinna znaleźć się 
  możliwość wyboru koloru i potwierdzenia gotowości. Wtedy wysłać POST na serwer 
  z informacjami o graczu, żeby utworzyć nowy obiekt i dodać do pokoju

  
*/

export { rollDice, testOrder, startGame };
