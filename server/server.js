
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//My own Modules
var {generateMessage,generateLocationMessage} = require('./utils/message');

//path is used to go back a directory neatly by __dirname , '../public'
const path = require('path');
const publicPath = path.join(__dirname , '../public');


const port = process.env.PORT || 3000;

//setup the server to serve static files from the public folder
app.use(express.static(publicPath));

io.on('connection' , (socket) => {
    console.log('new user connected');

   socket.emit('newMessage',generateMessage('Admin','Welcome to the chat room'));

   socket.broadcast.emit('newMessage',generateMessage('Admin','A new member has joined'))

   socket.on('createMessage', (message,callback) => {

        callback('This is from the server');
        console.log(`${message.from} just created a message which is now being broadcasted`);
        
        io.emit('newMessage',generateMessage(message.from,message.text));
      
   });

   socket.on('createLocation', (coordinates,callback) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coordinates.latitude,coordinates.longitude));  
   });


    socket.on('disconnect' , () =>{
        console.log('Client Disconnected ');
    });
});


server.listen(port , (err) => {
    if(err) return console.log(err);

    console.log(`server started at port ${port}`);
});
