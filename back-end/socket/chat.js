module.exports = function (io) {

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('messageToAll', (msg) => {
      console.log(`new message in public chat : ${msg.data}`)
      io.emit('messageToAll', {type: 'new_public_message', data: msg.data})
    });
  })
}
