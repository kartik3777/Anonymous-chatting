const express = require("express");
const {Server} = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : ["http://localhost:3000"],
        methods:["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log("user connected", socket.id);


    //disconnect
    io.on('disconnect', () => {
        console.log("user disconncted", socket.id);
    })
})

module.exports ={
    app,
    server
}