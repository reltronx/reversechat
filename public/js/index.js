var socket = io();

socket.on('connect', () => {
    console.log('connected to server');   
});

socket.on('disconnect' ,function(){
    console.log('Client Disconnected ');
});

socket.on('newMessage', function(message){
    console.log('New message Arrived',message);

    var li = jQuery('<li></li>');
    li.text(`${message.from} : ${message.text}`);
    jQuery("#messages").append(li);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage',{
        from: 'user',
        text: jQuery('[name="message"]').val()
    },function(data){
        console.log('Got it',data);
    });

    jQuery('[name="message"]').val()='';
});