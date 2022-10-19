require('dotenv').config();
const express = require('express');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('DB is OK'))
  .catch(() => console.log('DB failed'));

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());

    const io = require('socket.io')(server, {
        cors: {
            origin: "http://127.0.0.1:5500",
            methods: ["GET", "POST"]
        }
    })

    /*Nous pouvons utiliser la constante io pour le websocket*/
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`);
        io.emit('notification', `Bye ${socket.id}`);
        });

        console.log(`Connecté au client ${socket.id}`);
        io.emit('notification', `Bonjour, ${socket.id}`);
    })

    require('./socket/chat')(io);
    
    app.use(function (req, res, next) { req.io = io; next(); });
    const userRoutes = require('./routes/user');
    app.use('/auth', userRoutes);
    
    app.get('/test', (req, res, next) => {
        res.status(200).json({ hello: 'world' })
    })
}