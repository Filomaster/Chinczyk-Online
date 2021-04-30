"use strict";
const { out, colors } = require("../components/utils");
const express = require("express");
const RoomManager = require("../classes/RoomManager");
const router = express.Router();

router.post("/user/", (req, res) => {
  let name = req.body.name;
  if (req.session.user && req.session.roomId) {
    RoomManager.getRoom(req.session.roomId).then((room) => {
      room.players.find((a) => {
        return a.uid == req.session.user.uid;
      }).name = name;
      RoomManager.update(req.session.roomId, room).then((updated) => {
        req.session.user.name = updated.players.find((a) => {
          return a.uid == req.session.user.uid;
        }).name;
        console.log(req.session.user);
      });
      // if (modifiedUser) {
      //   modifiedUser.name = name;
      //   RoomManager.updateUser(
      //     req.session.roomId,
      //     req.session.user,
      //     modifiedUser
      //   );
      // .then((user) => {
      //   req.session.user.name = user.players.find((a) => {
      //     return a.uid == req.session.user.uid;
      //   }).name;
      //   RoomManager.getRoom(req.session.roomId).then((r) => {
      //     console.log(("ROOM AFTER MODIFY : ", r));
      //   });
      // });
    });
    // RoomManager.updateUser(req.session.roomId, req.session.user);
    return res.sendStatus(200);
  }
  out.printStatus(
    colors.red,
    "ROOMS",
    "ERROR",
    `Wrong request body`,
    req.session
  );
  return res.sendStatus(400);
});

module.exports = router;
