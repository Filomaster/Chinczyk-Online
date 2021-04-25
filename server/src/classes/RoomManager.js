"use strict";

const Datastore = require("nedb");
const Room = require("../classes/Room");
const Player = require("../classes/Player");
const { out, colors, getRandomInt: rnd } = require("./utils");

class RoomManager {
  #database;
  constructor() {
    this.#database = new Datastore({ filename: "./server/database/rooms.db", autoload: true });
  }

  createRoom()
}

module.exports = new RoomManager();
