//native modules
const path = require('path');
const http = require('http');

//external modules
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection' , (socket) => {
    console.log('new user connected');


    socket.on('disconnect' , () =>{
        console.log('Client Disconnected ');
    })
});






server.listen(port , (err) => {
    if(err) return console.log(err);

    console.log(`server started at port ${port}`);
});
