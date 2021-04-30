"use strict";

class UserManager {
  #userList = [];

  constructor() {
    this.#userList = [];
  }

  get users() {
    return this.#userList;
  }

  addUser(user) {
    this.#userList.push(user);
  }
}

module.exports = new UserManager();
