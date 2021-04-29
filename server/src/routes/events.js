const { response } = require("express");
const express = require("express");
const { out, colors, getRandomInt: rnd } = require("../components/utils");

const router = express.Router();

let clients = [];

router.get("/", (req, res) => {
  //prettier-ignore
  const headers = {
    'Content-Type' : 'text/event-stream',
    'Connection' : 'keep-alive',
    'Cache-Control' : 'no-cache',
  };
  res.writeHead(200, headers);

  let client = {
    id: req.session.user.uid,
    room: req.session.roomId,
    res,
  };
  clients.push(client);
  out.printStatus(
    colors.yellow,
    "EVENTS",
    "ADD",
    `Added client : ${client.id} | room: ${client.room}`
  );

  req.on("close", () => {
    out.printStatus(colors.yellow, "EVENTS", "CLOSED", "Connection closed");
  });

  setInterval(() => {
    clients.forEach((client) => {
      if (client.room == "027664") client.res.write("data: test \n\n");
    });
  }, 1000);
});

module.exports = router;
