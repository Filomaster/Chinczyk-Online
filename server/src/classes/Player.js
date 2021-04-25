"use strict";

// prettier-ignore
class Player {
  //#region Private fields
  uid; // user id, unique for each user
  color; // color representing 
  positions = [0, 0, 0, 0];
  //#endregion


  constructor(uid, color) {
    this.color = color;
  }

  get color() { this.color; }
  set color(color) {this.color = color;}
  get positions() { return this.positions; }
}

module.exports = Player;
