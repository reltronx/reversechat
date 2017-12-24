var socket = io();

socket.on('connect', () => {
    console.log('connected to server');
});

socket.on('disconnect' , () =>{
    console.log('Client Disconnected ');
});

socket.on('newMessage', function(message){
    console.log('New message Arrived',message);
});