const sMessage = require("../models/message");

module.exports = function (io) {
  io.on("connection", (socket) => {
    let userid = "";

    console.log(`Connecté au client ${socket.id}`);
    io.emit("notification", { type: "new_user", data: socket.id });

    sMessage.find((err, data) => {
      if (err) throw err;
      socket.emit("data", data);
    });

    group(socket);

    socket.on("group", () => {
      group(socket);
    });
    // sMessage.aggregate(
    //   [{ $group: { _id: "$userid", messages: { $push: "$$ROOT" } } }],
    //   function (err, result) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log(result);
    //       socket.emit("group", result);
    //     }
    //   }
    // );

    // Listener sur la déconnexion
    socket.on("disconnect", () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit("notification", { type: "removed_user", data: socket.id });
    });

    socket.on("userid", (id) => {
      userid = id;
    });

    // On écoute les messages envoyés dans le canal "send"
    socket.on("send", (msg, timestamp, userId) => {
      const message = new sMessage({
        text: msg,
        timestamp: timestamp,
        sessionid: socket.id,
        userid: userId,
      });

      // Sauvegarde dans la base de données
      message
        .save()
        .then(() => {
          sMessage.count({}, function (err, count) {
            console.log("Number of messages:", count);
            io.emit("send", message, count);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });
};

function group(socket) {
  sMessage.aggregate(
    [{ $group: { _id: "$userid", messages: { $push: "$$ROOT" } } }],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        socket.emit("group", result);
      }
    }
  );
}
