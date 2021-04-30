// Author: Filip 'Filomaster' Majorek
// Description: This is window class. It creates filled with content windows. Pretty universal
"use strict";

/**
 * This class is template for all custom windows used in this project
 */
export default class Window {
  //#region Class fields; Non private sadly, but Firefox still don't supports them
  title = "window"; // Window title
  options = {
    message: null, // Message showed in window instance
    input: null, // Input showed in window instance
    size: { width: 70, height: 40, unit: "vh" }, // Size of the window instance
  };
  buttons = [{ name: "ok", callback: null }];
  window = null;
  value = null;
  //#endregion

  //#region Constructor with jsdoc
  /**
   * Creates new Window object
   * @param {string} title - Title of the window
   * @param {Object} [options] - Window option such as message, option and size
   * @param {string} [options.message] - Message showed in window
   * @param {Object} [options.input] - Input field
   * @param {string} [options.input.name] - Name of the input field showed in window; Also placeholder
   * @param {number} [options.input.min] - Min length of input
   * @param {number} [options.input.max] - Max length of input
   * @param {Object} [options.size] - Window size
   * @param {number} options.size.width - Window width
   * @param {number} options.size.height - Window height
   * @param {string} options.size.unit - CSS unit
   */
  constructor(title, options, buttons) {
    this.title = title;
    this.options.message = options.message || null;
    this.options.input = options.input || null;
    if (options.size) {
      this.options.size.width = options.size.width || 70;
      this.options.size.height = options.size.height || 40;
      this.options.size.unit = options.size.unit || "vh";
    }
    this.value = null;
    if (buttons) this.buttons = buttons;
  }
  //#endregion

  // //#region Getters and setters
  // set buttons(buttons) { this.buttons = buttons; } //prettier-ignore
  // get value() { return this.value; } //prettier-ignore
  // get window() { return this.window; } //prettier-ignore
  // //#endregion

  //#region class methods

  updateInputValue(e) {
    this.value = e.target.value;
  }

  /**
   * Make and return 'title' div of window
   * @returns window title
   */
  getTitle() {
    let title = document.createElement("div");
    title.style = `background-color: #C8503F; display: grid; place-items: center; font-size: 2em; font-weight: 600;`;
    title.innerText = this.title;
    return title;
  }

  /**
   * Make and return 'content' div with message and/or input
   * @returns window content
   */
  getContent() {
    let content = document.createElement("div");
    content.style = "display: grid; place-items: center; font-size: 1.5em;";
    if (this.options.message) content.innerHTML = `<div>${this.options.message}</div>`;
    if (this.options.input) {
      let input = document.createElement("input");
      input.style = `width: 90%; height: 30%; background-color: transparent; border: 2px solid white; 
        border-radius: 20px; font-family: 'Open Sans', sans-serif; font-size: 1.5em; color: white; text-align: center`;
      input.type = "text";
      input.maxLength = this.options.input.max;
      input.minLength = this.options.input.min;
      input.placeholder = this.options.input.name;
      console.log("input this: ", this);
      input.oninput = this.updateInputValue.bind(this);
      content.appendChild(input);
    }
    return content;
  }

  /**
   * Make and return div with buttons
   * @returns window buttons
   */
  getButtons() {
    let buttonContainer = document.createElement("div");
    buttonContainer.style = `width: 100%; height: 100%; display: flex; justify-content: space-around;`;
    for (let i = 0; i < this.buttons.length; i++) {
      document.styleSheets[0].insertRule(
        ".window-button:hover {background-color: #FF7D50; cursor: pointer;}",
        0
      );
      document.styleSheets[0].insertRule(
        ".window-button{background-color: #C8503F; width: 40%; height: 60%; border: none; border-radius: 15px; color: white; font-size: 1.5em }",
        0
      );
      let button = document.createElement("button");
      //   button.style = ``;
      button.classList = "window-button";
      button.innerText = this.buttons[i].name;
      button.onclick = this.buttons[i].callback;
      buttonContainer.appendChild(button);
    }
    return buttonContainer;
  }

  /**
   * Assembles and returns window instance
   * @returns Window element
   */
  createWindow() {
    let size = this.options.size;
    this.window = document.createElement("div");
    // Style of the 'back' div, which blocks page interaction while window is displayed
    this.window.style =
      "position: absolute; background-color: #00000055; width:100%; height: 100%;" +
      "display: grid; place-items: center;";
    let windowBody = document.createElement("div");
    // TODO: If u want stylize window, do it here
    windowBody.style = `width: ${size.width + size.unit};
        height: ${size.height + size.unit}; 
        background-color: #333; display: grid;
        grid-template-rows: 2fr 6fr 2fr;
        border-radius: 1em; overflow: hidden;
        box-shadow: 0 0 2vh #000a`;

    windowBody.appendChild(this.getTitle());
    windowBody.appendChild(this.getContent());
    windowBody.appendChild(this.getButtons());
    this.window.appendChild(windowBody);

    return this.window;
  }
  //#endregion
}
