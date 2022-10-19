module.exports = function (io) {
  const sMessage = require('../models/message');

  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });
    
    socket.on('chat', (message) => {
      const msg = new sMessage({
        text: message.data,
        timestamp: new Date(),
        userid: "azdazdazdzad"
    });

    msg.save().then(() => {
      io.emit('chat', message.text);
    }).catch((error) => {
      console.log(error)
    })
    });
  })
}