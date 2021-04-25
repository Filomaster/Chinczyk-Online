"use strict";

const Player = require("./Player");
const Room = require("./Room");

class Game {
  //#region Private fields
  #room; // Room binded to this Game instance; Can not be changed
  #endModes = { toFirst: 0, toLast: 1 }; // Enumerator for determining end condition;
  #endMode = 1; // Current end mode; By default game will wait for everyone to finnish
  //#endregion

  /**
   *
   * @param {Room} room - instance of the Room class which will be binded to this game
   */
  constructor(room) {
    this.#room = room;
  }

  //#region getters and setters
  get endMode() { this.#endModes; } //prettier-ignore
  set endMode(mode) { this.#endMode = mode; } //prettier-ignore
  //#endregion
}
