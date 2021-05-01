// Author: Filip 'Filomaster' Majorek
// Description: This is router file for game endpoints

const express = require("express");
const PlayerManager = require("../classes/PlayerManager");
const RoomManager = require("../classes/RoomManager");
const { out, colors, getRandomInt: rnd } = require("../components/utils");

const router = express.Router();
const rooms = RoomManager;
const user = PlayerManager;

// symbols for transcribing
const symbols = ["a", "b", "3", "d", "5", "f", "g", "z", "i"];

/* 
  dane gry będą pobierane z /game:roomid. Ten endpoint będzie zwracał wszystkie
  informacje o pokoju (głównie listę graczy z pozycjami ich pionków i informacje o 
  obecnej kolejce gracza i ilości pozostałych rzutów
*/

let randomColor = () => {
  let colors = ["yellow", "red", "blue", "green"];
  return colors[rnd(0, 3)];
};

let sess;
//TODO: This is probably wrong endpoint for this stuff, but i just leave this here for now
router.get("/", (req, res) => {
  // res.sendFile("../../../static/html/game.html");
  //! Code below is important, commented only for tests
  sess = req.session;
  sess.user = user.createUser();
  // rooms.createNew(sess.user).then((newRoom) => {
  //   rooms.save(newRoom);
  //   console.log(newRoom);
  //   sess.roomId = newRoom.id;
  //   out.info("New session user: " + sess.user.uid);
  //   res.redirect("/");
  // });
  // res.redirect("/game/" + sess.roomId);
});

// !Change to post
router.post("/create/", (req, res) => {
  if (!req.session.user) req.session.user = user.createUser();
  if (req.session.roomId) {
    out.printStatus(
      colors.red,
      "CREATE",
      "ERROR",
      `User ${req.session.user.uid} tried to  create new room but is already in room #${req.session.roomId}`
    );
    return res.status(403).send("You can't join another room while being in one!");
  }
  req.session.user.color = randomColor();
  rooms.createNew(req.session.user).then((newRoom) => {
    rooms.save(newRoom);
    console.log(newRoom);
    req.session.roomId = newRoom.id;
    out.info("New session user: " + req.session.user.uid);
    res.cookie("host", "true");
    res.cookie("color", req.session.user.color);
    res.sendStatus(200);
  });
});

//check if player is already in game
router.post("/check/", (req, res) => {
  out.warn(req.session.user, req.session.roomId);
  if (!req.session.user && !req.session.roomId) return res.sendStatus(404);
  rooms.getRoom(req.session.roomId).then((room) => {
    if (!room) {
      delete req.session.roomId;
      return res.sendStatus(404);
    }
    return res.sendStatus(200);
  });
});

router.post("/join/", (req, res) => {
  let roomId = req.body.roomId;
  if (!req.session.user) req.session.user = user.createUser();
  rooms.getRoom(roomId).then((room) => {
    if (!room) {
      out.printStatus(colors.red, "JOIN", "ERROR", `Tried to join non-existing room #${roomId}`);
      return res.status(404).send(`Room #${roomId} does not exist :c`);
    }
    if (req.session.roomId) {
      out.printStatus(
        colors.red,
        "JOIN",
        "ERROR",
        `User ${req.session.user.uid} tried to join room #${req.body.roomId} but is already in #${req.session.roomId}`
      );
      return res.status(403).send("You can't join another room while being in one!");
    }
    if (room.players.length >= 4) {
      out.printStatus(
        colors.yellow,
        "JOIN",
        "WARN",
        `Tried to join to room #${roomId} but it's full`
      );
      return res.status(403).send("The room is full. Select other room or create new");
    }
    if (room.state == "game") {
      out.printStatus(
        colors.yellow,
        "JOIN",
        "WARN",
        `Tried to join to room #${roomId} but the game already started`
      );
      return res.status(403).send("The game has begin. Can't join in the middle of game");
    }
    if (!room.players.find((a) => a.uid == req.session.user.uid)) {
      let color;
      do {
        color = randomColor();
      } while (room.players.find((a) => a.color == color) != undefined);
      req.session.user.color = color;
      res.cookie("color", req.session.user.color);
      rooms.join(roomId, req.session.user);
      req.session.roomId = roomId;
      out.printStatus(
        colors.green,
        "JOIN",
        "OK",
        `User ${req.session.user.uid} joined room #${req.body.roomId}`
      );
    }
    res.sendStatus(200);
  });
});

router.get("/join/:roomId", (req, res) => {
  let roomId = req.params.roomId;
  if (!req.session.user) req.session.user = user.createUser();
  rooms.getRoom(roomId).then((room) => {
    if (!room) {
      out.printStatus(colors.red, "JOIN", "ERROR", `Tried to join non-existing room #${roomId}`);
      return res.sendStatus(404);
    }
    if (req.session.roomId) {
      out.printStatus(
        colors.red,
        "JOIN",
        "ERROR",
        `User ${req.session.user.uid} tried to join room #${req.body.roomId} but is already in #${req.session.roomId}`
      );
      return res.status(403).send("You can't join another room while being in one!");
    }
    if (room.players.length >= 4) {
      out.printStatus(
        colors.yellow,
        "JOIN",
        "WARN",
        `Tried to join to room #${roomId} but it's full`
      );
      return res.status(403).send("The room is full. Select other room or create new");
    }
    if (room.state == "game") {
      out.printStatus(
        colors.yellow,
        "JOIN",
        "WARN",
        `Tried to join to room #${roomId} but the game already started`
      );
      return res.status(403).send("The game has begin. Can't join in the middle of game");
    }
    if (!room.players.find((a) => a.uid == req.session.user.uid)) {
      let color;
      do {
        color = randomColor();
      } while (room.players.find((a) => a.color == color) != undefined);
      req.session.user.color = color;
      rooms.join(roomId, req.session.user);
      req.session.roomId = roomId;
      out.printStatus(
        colors.green,
        "JOIN",
        "OK",
        `User ${req.session.user.uid} joined room #${req.body.roomId}`
      );
    }
    res.redirect("/");
  });
});

router.post("/start/", (req, res) => {
  let roomId = req.session.roomId;
  rooms.getRoom(roomId).then((room) => {
    out.printStatus(colors.green, "GAME", "START", `started game in room ${roomId}`);
    room.state = "game";
    let pColors = ["yellow", "red", "blue", "green"];
    for (let i = 0; i < 4; i++) {
      if (room.players.find((a) => a.color == pColors[i])) {
        console.log("Player with color " + pColors[i]);
        room.turn = pColors[i];
        break;
      }
      RoomManager.update(req.session.roomId, room).then((updated) => {
        console.log(updated);
        res.end();
        // res.sendStatus(200);
      });
    }
  });
});

router.post("/action/", (req, res) => {
  let roomId = req.session.roomId;
  rooms.getRoom(roomId).then((room) => {
    let player = room.players.find((a) => a.uid == req.session.user.uid);
    console.log("Action", player, req.body.piece);
    if (player.positions[req.body.piece] == 0) player.positions[req.body.piece] = 1;
    else player.positions[req.body.piece] += room.throwValue;

    let pColors = ["yellow", "red", "blue", "green"];

    // if (room.players.find((a) => a.uid != req.session.user.uid)) {
    //   let add = { yellow: 0, red: 10, blue: 20, green: 30 };
    //   room.players
    //     .find((a) => a.uid != req.session.user.uid)
    //     .forEach((element) => {
    //       element.positions.forEach((piece) => {
    //         if (piece + add[element.color] == player.positions[req.body.piece]) piece = 0;
    //       });
    //     });
    // }

    if (room.throwValue != 6) {
      console.log("current turn: " + room.turn + "default queue" + pColors);
      for (i = 0; i < pColors.indexOf(room.turn); i++) {
        pColors.push(pColors.shift());
      }
      console.log("shifted queue: " + pColors);

      for (let i = 0; i < 4; i++) {
        if (room.players.find((a) => a.color == pColors[i])) {
          if (pColors[i] != room.turn || room.players.length == 1) {
            console.log("Player with color " + pColors[i]);
            room.turn = pColors[i];
            break;
          }
        }
      }
    }
    rooms.update(roomId, room).then(() => {
      res.sendStatus(200);
    });
  });
});

//! GET CURRENT ROOM STATE
router.post("/state/", (req, res) => {
  let roomId = req.session.roomId;
  if (!req.session.user) return res.sendStatus(403);
  rooms.getRoom(roomId).then((room) => {
    if (!room) {
      out.printStatus(colors.red, "FETCH", "ERROR", `Room #${roomId} does not exist`);
      return res.sendStatus(404);
    }
    if (!room.players.find((a) => a.uid == req.session.user.uid)) return res.sendStatus(403);
    delete room._id;
    console.log(room);
    res.send(JSON.stringify(room));
  });
}); //post

router.post("/dice/", (req, res) => {
  let roomId = req.session.roomId;
  let num = rnd(1, 6);
  console.log(num);
  rooms.getRoom(roomId).then((room) => {
    let positions = room.players.find((a) => a.uid == req.session.user.uid).positions;
    console.log(positions);
    let moves = [];
    for (let i = 0; i < 4; i++) {
      if (positions[i] == 0 && num != 6 && num != 1) moves.push(false);
      else if (positions[i] > 38 && positions[i] + num > 44) moves.push(false);
      else moves.push(true);
    }
    console.log(moves);
    res.send(JSON.stringify({ dice: num, moves }));
    room.throws++;
    room.throwValue = num;
    rooms.update(roomId, room);
  });
}); //rzucanie kostką

router.get("/id/", (req, res) => {
  res.send(JSON.stringify({ id: req.session.roomId }));
});

router.get("/test/", (req, res) => {
  if (!req.session.user) req.session.user = user.createUser();
  res.redirect("/game/join");
  // out.debug(req.session);
  // out.print(colors.magenta, "TEST", user.getUsers());
  // if (!user.hasUser(req.session.user.uid)) {
  //   out.error(`Unknown user ${req.session.user.uid}!`);
  //   req.session.destroy((err) => {
  //     if (err) out.error(err);
  //   });
  //   res.redirect("/game/");
  // }
  // // output.info(sess);
  // res.end();
});
module.exports = router;
