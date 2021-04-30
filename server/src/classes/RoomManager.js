"use strict";

const Datastore = require("nedb");
const Room = require("../classes/Room");
const Player = require("../classes/Player");
const { out, colors, getRandomInt: rnd } = require("../components/utils");

class RoomManager {
  //#region Private class fields
  #database; // common instance of the database
  #maxRooms = 30000; // maximal amount of rooms which can be created at the same time
  #maxRoomNumber = 30000; // maximal index of the last room. must be lower than 999999
  //#endregion

  constructor() {
    this.#database = new Datastore({
      filename: "./server/database/rooms.db",
      autoload: true,
    });
  }

  /**
   * Creates new room with generated id, and default settings
   * @param {Player} player - Player object, represents creator of the room
   * @returns Promise with serialized room object
   */
  async createNew(player) {
    let self = this; // hack to use 'this' inside promise callback
    // Check if maximal room amount wasn't exceeded. If this is the case, throw RangeError
    if ((await this.getRoomCount()) > this.#maxRooms)
      throw new RangeError(
        `Exceeded maximum room number! Remove old rooms or change room limit [currently ${
          this.#maxRooms
        }]`
      );
    return new Promise(async (res, rej) => {
      let id;
      // Generate 6-digit room id; If amount of digits is lower than 6, append 0 at the beginning
      do {
        id = rnd(1, self.#maxRoomNumber).toString();
        for (let i = id.length; i < 6; i++) {
          id = "0" + id;
        }
      } while (await self.checkExist(id)); // If room already exist, generate new id
      out.printStatus(
        colors.green,
        "ROOM MANAGER",
        "SUCCESS",
        `generated new room with id #${id}`
      );
      let room = new Room({ id, player }); // Create new room object
      res(Room.serialize(room)); // return object with new room
    });
  }

  /**
   * Saves serialized Room object to database
   * @param {Room.serialize} room - generated room to save into database
   */
  save(room) {
    this.#database.insert(room, (err, doc) => {
      if (err) return out.printStatus(colors.red, "ROOM MANAGER", "ERROR", err);
    });
  }

  /**
   * Join new player to existing room
   * @param {string} id - room id
   * @param {Player} player - new player object
   */
  async join(id, player) {
    this.#database.update(
      { id: id },
      { $push: { players: player } },
      (err, num, room) => {
        if (err)
          return out.printStatus(colors.red, "ROOM MANAGER", "ERROR", err);
        out.printStatus(colors.yellow, "ROOM MANAGER", "MODIFIED", room);
      }
    );
  }

  /**
   * Returns number of all existing rooms
   * @returns Promise containing active rooms number
   */
  getRoomCount() {
    return new Promise((res, rej) => {
      this.#database.count({}, (err, count) => {
        if (err) rej(err);
        res(count);
      });
    });
  }

  async updateUser(roomid, oldPlayer, newPlayer) {
    let self = this;
    this.#database.find({ id: roomid }, (err, doc) => {
      let dbPlayer = doc[0].players.find((a) => a.uid == oldPlayer.uid);
      out.debug(dbPlayer, oldPlayer, newPlayer, oldPlayer == dbPlayer);
    });
    // return new Promise((res, rej) => {
    //   this.#database.update(
    //     { id: roomid },
    //     { $pull: { players: oldPlayer } },
    //     { returnUpdatedDocs: true },
    //     (err, num, room) => {
    //       // console.log(err, num, room);
    //       if (err) {
    //         return out.printStatus(colors.red, "DATABASE", "ERROR", err);
    //         // rej(err);
    //       }
    //       out.printStatus(colors.yellow, "ROOM MANAGER", "PULL", room);
    //       self.#database.update(
    //         { id: roomid },
    //         { $push: { players: newPlayer } },
    //         { returnUpdatedDocs: true },
    //         (err, num, room) => {
    //           // console.log(err, num, room);
    //           if (err) {
    //             return out.printStatus(colors.red, "DATABASE", "ERROR", err);
    //             // rej(err);
    //           }
    //           out.printStatus(colors.green, "ROOM MANAGER", "PUSH", room);
    //           res(room);
    //         }
    //       );
    //     }
    //   );
    // });
  }

  /**
   * Search for room with given id in database. Returns true if room exists
   * @param {string} id - id of the room
   * @returns Promise<boolean>
   */
  async checkExist(id) {
    let self = this; // hack to use `this` inside lambda function
    return (
      (await new Promise((res, rej) => {
        self.#database.find({ id: id }, (err, docs) => {
          if (err) rej(out.printStatus(colors.red, "DATABASE", "ERROR", err));
          res(docs.length);
        });
      })) > 0
    );
  }

  /**
   * Search and returns room with given id
   * @param {string} id - room id
   * @returns room object
   */
  async getRoom(id) {
    let self = this;
    return new Promise((res, rej) => {
      self.#database.find({ id: id }, (err, doc) => {
        if (err) rej(out.printStatus(colors.red, "DATABASE", "ERROR", err));
        res(doc[0]);
      });
    });
  }
}

module.exports = new RoomManager();
