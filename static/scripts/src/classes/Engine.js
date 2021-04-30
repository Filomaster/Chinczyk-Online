"use strict";
import Window from "./Window.js";

export default class Engine {
  //#region Static class fields, responsible for storing players pawns positions
  // All numbers of fields (in order from left bottom, yellow side, clockwise)
  //prettier-ignore
  static fields = [
    148, 135, 122, 109, 96, 95, 94, 93, 92, 79, 66, 67, 68,
    69, 70, 57, 44, 31, 18, 19, 20, 33, 46, 59, 72, 73, 74,
    75, 76, 89, 102, 101, 100, 99, 98, 111, 124, 137, 150, 149
  ];
  // All player 'homes' position (from entrance)
  static homes = {
    yellow: [136, 123, 110, 97],
    red: [80, 81, 82, 83],
    blue: [32, 45, 58, 71],
    green: [88, 87, 86, 85],
  };
  static offset = { yellow: 0, red: 10, blue: 20, green: 30 };
  static order = { yellow: 1, red: 2, blue: 3, green: 4 };
  static //#endregion
  window = null;

  constructor(parent) {
    this.parent = parent;
  }

  gameBoard = {
    //create game board
    create: () => {
      for (let i = 0; i < 169; i++) {}
    },
    // update positions on board
    update: () => {
      fetch("game/state/", { method: "POST" }).then((res) => {
        res.text().then((text) => {
          let gameData = JSON.parse(text);
          gameData.players.forEach((player) => {
            let playerBar = document.createElement("div");
            playerBar.style.backgroundColor = player.color;
            console.log(player);
            playerBar.order = Engine.order[player.color];
            playerBar.innerText = player.name;
            document.getElementById("player-panel").append(playerBar);
          });
        });
      });
    },
  };
  windowManager = {
    /**
     *
     * @param {Window} window
     */
    show: (window) => {
      this.parent.append(window.createWindow());
    },
    clear: (window) => {
      this.parent.removeChild(window.window);
    },
    displayPrompt: (message, parent) => {},
  };
}
