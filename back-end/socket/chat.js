module.exports = function (io) {
//websocket listening all these channels and emit back some data sent by one user to share it to everyone

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    //messageToAll in case we build a mp feature in da future
    socket.on('messageToAll', (msg) => {
      console.log(`new message in public chat : ${msg.data}`)
      io.emit('messageToAll', {type: 'new_public_message', data: msg.data})
    });
  })
}
