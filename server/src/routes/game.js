// Author: Filip 'Filomaster' Majorek
// Description: This is router file for game endpoints

const express = require("express");
const rooms = require("../components/roomManager");
const PlayerManager = require("../classes/PlayerManager");
const { out, colors } = require("../components/utils");

const router = express.Router();

let user = PlayerManager;

// ! Functionality moved to userManager
// let manageUsers = {
//   // Creating new id for user (even if their username may be same as someone's else in different room,
//   // id will stay unique)
//   createUser: () => {
//     let userId = "";
//     do {
//       // User id will be 5 randomly selected, lower case characters
//       for (let i = 0; i < 5; i++) {
//         userId += String.fromCharCode(utils.getRandomInt(97, 122));
//       }
//     } while (users.has(userId)); // Making sure that id is unique
//     users.add(userId); // Adding user id to the set
//     return userId;
//   },
// };

// let all_sess = [];
let sess;
router.get("/", (req, res) => {
  sess = req.session;
  // sess.room = getRandomInt(0, 500);
  sess.user = user.createUser();
  out.info("New session user: " + sess.user.uid);
  res.redirect("/game/test/");
});

router.get("/create/", (req, res) => {
  rooms.createRoom(req.session.uid);
  res.end();
});

router.get("/test/", (req, res) => {
  out.debug(req.session);
  out.print(colors.magenta, "TEST", user.getUsers());
  if (!user.hasUser(req.session.user.uid)) {
    out.error(`Unknown user ${req.session.user.uid}!`);
    req.session.destroy((err) => {
      if (err) out.error(err);
    });
    res.redirect("/game/");
  }
  // output.info(sess);
  res.end();
});
module.exports = router;
