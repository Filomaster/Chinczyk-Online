"use strict";

export default class PageLoader {
  //#region Private class fields
  #parent = null;
  #scripts = null;
  //#endregion

  constructor(parent) {
    this.#parent = parent;
  }

  load(path, scripts) {
    //scripts is {name: path}
    this.#scripts = scripts;
    fetch(path).then((res) => {
      res
        .text()
        .then((content) => {
          this.#parent.innerHTML = content;
        })
        .then(() => {});
    });
  }
}
