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
  static bases = {
    yellow: [131, 132, 144, 145],
    red: [14, 15, 27, 28],
    blue: [23, 24, 36, 37],
    green: [140, 141, 153, 154],
  };
  static colors = {
    yellow: "#FFCB6D",
    red: "#FF6176",
    blue: "#555BCC",
    green: "#5ECC74",
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
    clearBoard: () => {
      let board = document.getElementById("board");
      board.innerHTML = "";
      for (let i = 0; i < 169; i++) {
        let field = document.createElement("DIV");
        field.dataset.num = i;
        board.appendChild(field);
      }
      // board.childNodes.forEach((child) => {
      //   child.style.cssText = "";
      //   // let clean = document.createElement("div");
      //   // clean.dataset.num = child.dataset.num;
      //   // child = clean;
      // });
    },
    drawPiece: (position, color, index, move) => {
      console.log(move);
      let board = document.getElementById("board");
      board.childNodes.forEach((child) => {
        if (child.dataset.num == position) {
          child.style.width = "90%";
          child.style.height = "90%";
          child.style.marginLeft = "5%";
          child.style.marginTop = "5%";
          child.style.borderRadius = "50%";
          child.style.boxShadow = "2px 2px 10px #000000cc";
          child.style.backgroundColor = Engine.colors[color];
          if (move == true) {
            child.style.filter = "brightness(1.2)";
            child.addEventListener("click", () => {
              fetch("/game/action/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ piece: index }),
              }).then(() => {
                this.gameBoard.update();
              });
            });
          } else if (move == false) {
            child.style.filter = "brightness(0.6)";
          }
        }
      });
    },
    // update positions on board
    getColor: () => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("color"))
        .match(/(?==(.*)$)/)[1];
    },
    update: (moves) => {
      fetch("game/state/", { method: "POST" }).then((res) => {
        res.text().then((text) => {
          let gameData = JSON.parse(text);
          document.getElementById("player-panel").innerHTML = "";
          this.gameBoard.clearBoard();

          if (gameData.state == "waiting") {
          }
          console.log(gameData.turn, this.gameBoard.getColor());
          if (gameData.turn != this.gameBoard.getColor())
            document.getElementById("roll").disabled = true;
          else document.getElementById("roll").disabled = false;

          gameData.players.forEach((player) => {
            let playerBar = document.createElement("div");
            playerBar.style.backgroundColor = Engine.colors[player.color];
            // playerBar.style.background =
            //   "radial-gradient(ellipse, " +
            //   Engine.colors[player.color] +
            //   " 0%, " +
            //   Engine.colors[player.color + "Dark"] +
            //   " 100%)";
            playerBar.style.width = "95%";
            playerBar.style.height = "90%";
            playerBar.style.borderRadius = "20px";
            playerBar.style.color = "#111";
            playerBar.style.fontSize = "1.5em";
            playerBar.style.fontWeight = 800;
            playerBar.style.display = "grid";
            playerBar.style.placeItems = "center";
            playerBar.order = Engine.order[player.color];
            playerBar.innerText = player.name;
            document.getElementById("player-panel").append(playerBar);
            console.log(player.positions);
            for (let i = 0; i < 4; i++) {
              if (!moves || gameData.turn != this.gameBoard.getColor())
                moves = [null, null, null, null];
              if (player.positions[i] == 0)
                this.gameBoard.drawPiece(Engine.bases[player.color][i], player.color, i, moves[i]);
              else if (player.positions[i] > 40)
                this.gameBoard.drawPiece(Engine.homes[player.color][i], player.color, i, moves[i]);
              else {
                let boardPosition = player.positions[i] + Engine.offset[player.color];
                if (boardPosition >= 40) boardPosition -= 40;
                this.gameBoard.drawPiece(
                  Engine.fields[boardPosition - 1],
                  player.color,
                  i,
                  moves[i]
                );
              }
            }
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
