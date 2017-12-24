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



socket.on('newLocationMessage', function(location){
    console.log('New location message Arrived',location);

    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${location.from} : `);
    a.attr('href',location.url);
    li.append(a);
    jQuery("#messages").append(li);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var message = jQuery('[name="message"]');

    socket.emit('createMessage',{
        from: 'user',
        text: message.val()
    },function(data){
        message.val('');
        console.log('Got it',data);
    });

});


var locationButton = jQuery('#location');
locationButton.on('click', function(){

    if(!navigator.geolocation){
        return alert('browser support not avavilvale for geolocation');
    }

    locationButton.attr('disabled','disabled').text('sending location');

    navigator.geolocation.getCurrentPosition(function(position){

        locationButton.removeAttr('disabled').text('send location');

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        socket.emit('createLocation',{latitude,longitude},function(data){
            console.log("Got the location",data);
        });

    }, function(){
        locationButton.removeAttr('disabled').text('send location');
        return alert('unable to fetch location');
    });
});