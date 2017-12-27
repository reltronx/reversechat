var socket = io();
var param = jQuery.deparam(window.location.search);

var scrollToBottom = function(){

    //selectors

    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var clientHeight = messages.prop('clientHeight');
    var newMessageHeight =  newMessage.innerHeight();
    var lastMessageHeight =  newMessage.prev().innerHeight();

    if(scrollTop + clientHeight +  newMessageHeight + lastMessageHeight >= scrollHeight ){
        messages.scrollTop(scrollHeight);
    }
};


socket.on('connect', () => {
    console.log('connected to server');   
   
    socket.emit('join',param,function(err){
        if(err){
            alert(err.message);
            window.location.href ='/';
        }
    });
});

socket.on('disconnect' ,function(){
    console.log('Client Disconnected ');
});

socket.on('updateUserList',function(users){
    console.log(users);
    var ol = jQuery('<ol></ol>');
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery("#users").html('');
    jQuery("#users").append(ol);
})

socket.on('newMessage', function(message){

    var formatedTime = moment(message.createdAt).format('dd hh:mm a');
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formatedTime
    });
    jQuery("#messages").append(html);

    scrollToBottom();
    // 
    // console.log('New message Arrived',message);

    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formatedTime} : ${message.text}`);
    // jQuery("#messages").append(li);
});



socket.on('newLocationMessage', function(location){

    var formatedTime = moment(location.createdAt).format('dd hh:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template,{
        from:location.from,
        url:location.url,
        createdAt:formatedTime
    });
    jQuery("#messages").append(html);

    scrollToBottom();

    // var formatedTime = moment(location.createdAt).format('d:mm a');
    // console.log('New location message Arrived',location);

    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    // li.text(`${location.from} ${formatedTime} : `);
    // a.attr('href',location.url);
    // li.append(a);
    // jQuery("#messages").append(li);
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();

    var message = jQuery('[name="message"]');

    socket.emit('createMessage',{
        text: message.val()
    },function(data){
        if(!data){
            message.val('');
           return console.log('acknowledgement from the server');
        }
      
        console.log('oops');
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