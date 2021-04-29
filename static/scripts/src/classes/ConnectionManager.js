"use strict";
export default class ConnectionManager {
  content = null;
  static addresses = {
    home: "/home.html",
    game: "/game.html",
  };

  constructor(content) {
    this.content = content;
  }

  loadPage(address, callback) {
    let self = this;
    fetch(address).then((response) => {
      response
        .text()
        .then((content) => {
          self.content.innerHTML = content;
        })
        .then(() => {
          if (callback) callback();
        });
    });
  }
}
