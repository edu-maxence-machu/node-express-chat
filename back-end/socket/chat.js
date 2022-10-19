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
    
    socket.on('userMessage', (msg,userId) => {
      const message = new sMessage({
        text: msg,
        timestamp: new Date(),
        userid: userId
    });

    message.save().then(() => {
      io.emit('userMessage', msg);
    }).catch((error) => {
      console.log(error)
    })
    });

  })
}