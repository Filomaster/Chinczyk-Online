// Author: Filip 'Filomaster' Majorek
// Description: This is main game file

const Datastore = require("nedb");
const Room = require("../classes/Room");
const Player = require("../classes/Player");
const { out: out, getRandomInt: rnd, colors: colors } = require("./utils");

const db = new Datastore({
  filename: "./server/database/rooms.db",
  autoload: true,
});

// ! Data templates for easier managing rooms. They may be classes later
let templates = {
  // Player data template
  player: function (data) {
    return {
      uid: data.uid,
      nickname: data.nickname,
      positions: [0, 0, 0, 0],
      color: data.color,
    };
  },
  // Room data template
  room: function (data) {
    return {
      id: data.id,
      name: data.name, //url encoded!
      turn: 0,
      diceThrows: 3,
      players: [
        {
          uid: data.uid,
          nickname: data.nickname,
          positions: [0, 0, 0, 0],
          color: data.color,
        },
      ],
    };
  },
};

// Main module
module.exports = {
  getRoom: () => {},
  createRoom: async (user) => {
    //  Generating room id
    let id;
    do {
      out.printStatus(
        colors.green,
        "ROOM MGR",
        "INFO",
        "Generating room id..."
      );
      // Generating 6-digit room id. All numbers lower than 100000 will have 0's appended before number //TODO: Rephrase comment
      id = rnd(1, 300000).toString();
      for (let i = id.length; i < 6; i++) {
        id = "0" + id;
      }
    } while (
      // If room with identical id already exist, loop and generate new one
      (await new Promise((res, rej) => {
        db.find({ id }, (err, docs) => res(docs.length));
      })) > 0
    );
    out.printStatus(colors.green, "ROOM MGR", "INFO", `Created room #` + id);
    console.log(new Player("test"));
    console.log(
      Room.serialize(new Room({ id, player: new Player("test", "test") }))
    );
    // db.insert(new Room(id));
  },
};
