// Author: Filip 'Filomaster' Majorek
// Description: This is client-side game script
"use strict";

import Engine from "./classes/Engine.js";
import Window from "./classes/Window.js";
let engine = new Engine(document.getElementById("game-container"));
let loginWindow = new Window("Set username", { input: { name: "username", min: 1, max: 20 } });

loginWindow.buttons = [
  {
    name: "Close",
    callback: () => {
      engine.windowManager.clear(loginWindow);
    },
  },
  {
    name: "Ok",
    callback: () => {
      console.log(loginWindow.getValue());
      if (loginWindow.value) engine.windowManager.clear(loginWindow);
    },
  },
];
engine.windowManager.show(loginWindow);

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

function rollDice() {
  var dice = Math.floor(Math.random() * 6 + 1);

  for (var i = 1; i <= 6; i++) {
    document.getElementById("dice").classList.remove("show-" + i);
    if (dice === i) {
      document.getElementById("dice").classList.add("show-" + i);
    }
  }
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
      console.log(e.data);
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

export { rollDice, testOrder };
