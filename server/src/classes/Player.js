"use strict";

// prettier-ignore
class Player {
  //#region Private fields
  #uid; // user id, unique for each user
  #name;
  #color = undefined; // color representing 
  #dice = null;
  #positions = [0, 0, 0, 0];
  //#endregion


  constructor(uid, name) {
    this.#uid = uid;
    this.#name = name
    // this.color = color;
  }

  get color() { this.color; }
  set color(color) {this.color = color;}
  get positions() { return this.positions; }

  serialize(){
    return{
      uid: this.#uid,
      name: this.#name,
      color: this.#color,
      dice: this.#dice,
      positions: this.#positions
    }
  }
}

module.exports = Player;
