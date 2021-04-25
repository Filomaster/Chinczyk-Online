"use strict";

const Player = require("./Player");

class Room {
  //#region Private fields
  #id; // Id of the room; Can not be changed after initialization
  #name = "new room"; // Name of the room, can be changed
  #turn = 0; // Index of players array, indicates which player turn is
  #maxThrows = 3; // Maximal number of throws, after getting 6
  #diceThrows = 0; // Number of throws left
  #players = []; // Array of all players in the room
  //#endregion

  /**
   * Basic constructor of Room class. Sets room id as well as appending user who created it
   * @param {{id: string, player: Player}} data - object with id of new room and user creating it
   */
  constructor(data) {
    this.#id = data.id; // Create room with given id ()
    this.#players.push(data.player); // Add user who created room to the player list
    // Adding all parameters if completed object was giver in deserialization
    this.#name = data.name || "new room";
    this.#turn = data.turn || 0;
    this.#maxThrows = data.maxThrows || 3;
    this.#diceThrows = data.throws || 0;
  }

  static serialize(room) {
    return {
      id: room.#id,
      name: room.#name,
      turn: room.#turn,
      maxThrows: room.#maxThrows,
      throws: room.#diceThrows,
      players: room.#players,
    };
  }

  static deserialize(data) {
    return new Room(data);
  }
}

module.exports = Room;
