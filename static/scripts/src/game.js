// Author: Filip 'Filomaster' Majorek
// Description: This is client-side game script
"use strict";

function rollDice() {
  var dice = Math.floor(Math.random() * 6 + 1);

  for (var i = 1; i <= 6; i++) {
    document.getElementById("dice").classList.remove("show-" + i);
    if (dice === i) {
      document.getElementById("dice").classList.add("show-" + i);
    }
  }
}

gameField = document.getElementById("gameField");
gameField.style = "width: 100; height: 100; background-color: white";

export { rollDice };
