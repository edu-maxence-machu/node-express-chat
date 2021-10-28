require('dotenv').config();
const express = require('express');

// export one function that gets called once as the server is being initialized
module.exports = function (app, server) {

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', '*');
        next();
    });

    app.use(express.json());

    const io = require('socket.io')(server, {
        cors: {
            //:63342 port is the one used by my WebStorm IDE
            origin: ["http://127.0.0.1:5000", "http://localhost:63342"],
            methods: ["GET", "POST"]
        }
    })

    //add sockets functions the server
    require('./socket/chat')(io);

    app.use(function (req, res, next) { req.io = io; next(); });
    //a '/test' api call is made front side to test express (successful)
    app.get('/test', (req, res, next) => {
        res.status(200).json({ hello: 'world' })
    })
}
