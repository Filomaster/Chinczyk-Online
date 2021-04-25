"use strict";

const { out, colors, getRandomInt: rnd } = require("../components/utils");

/**
 * UserManager class is singleton managing all active users uids and names
 */
class UserManager {
  //#region Private class fields
  #activeUsers = new Map();
  //#endregion

  constructor() {}

  //#region Dynamic methods
  /**
   * Generates new, unique user id and adds user the collection of existing users
   * @param {string} name - [optional] name of the new user; same as uid by default
   * @return object containing uid and name
   */
  createUser = (name) => {
    let uid = "";
    // Create random, unique user id
    do {
      for (let i = 0; i < 5; i++) {
        uid += String.fromCharCode(rnd(97, 122));
      }
    } while (this.hasUser(uid));
    this.#activeUsers.set(uid, name || uid);
    return { uid, name: name || uid };
  };
  /**
   * Deletes user with given uid
   * @param {string} uid - uid of the user who will be removed form active users collection
   */
  delUser = (uid) => this.#activeUsers.delete(uid);
  /**
   * Checks if user with given uid exist
   * @param {string} uid - user id to search
   * @returns boolean
   */
  hasUser = (uid) => this.#activeUsers.has(uid);
  /**
   * Get list of all or specified users
   * @param {string[]} uidList - [optional] list of user ids
   * @returns array containing users ids and names
   */
  getUsers = (uidList) => {
    let userList = [];
    // If uid list was specified, create and return object containing uid and user name
    // else return  all active users
    if (uidList) {
      uidList.foreach((uid) => {
        userList.push({ uid, name: this.#activeUsers.get(uid) });
      });
    } else {
      this.#activeUsers.forEach((value, key) => {
        userList.push({ uid: key, name: value });
      });
    }
    return userList;
  };
  //#endregion
}

module.exports = new UserManager();
