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

    var ol = jQuery('<ol></ol>');
    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user.name + " count:= "+ user.count));
    });
    jQuery("#users").html('');
    jQuery("#users").append(ol);
})

socket.on('newMessage', function(message){

    let src = message.from === "Reverse bot" ? "https://news.bitcoin.com/wp-content/uploads/2018/04/bitcoin-trading-bot-1520x1024.jpg":"https://cdn1.vectorstock.com/i/1000x1000/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg"

    var formatedTime = moment(message.createdAt).format('dd hh:mm a');
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template,{
        src:src,
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

    });

});

