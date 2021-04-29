// Author: Filip 'Filomaster' Majorek
// Description: This is router file for game endpoints

const express = require("express");
const PlayerManager = require("../classes/PlayerManager");
const RoomManager = require("../classes/RoomManager");
const { out, colors } = require("../components/utils");

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
  rooms.createNew(req.session.user).then((newRoom) => {
    rooms.save(newRoom);
    console.log(newRoom);
    req.session.roomId = newRoom.id;
    out.info("New session user: " + req.session.user.uid);
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
    if (!room.players.find((a) => a.uid == req.session.user.uid)) {
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
    if (!room.players.find((a) => a.uid == req.session.user.uid)) {
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

//! GET CURRENT ROOM STATE
router.post("/state/", (req, res) => {
  let roomId = req.body.roomId;
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

router.post("/dice", (req, res) => {}); //rzucanie kostką

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
