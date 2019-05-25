
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const path = require('path');

//My own Modules
var {generateMessage} = require('./utils/message');
var {isRealString} = require('./utils/validation');
var {User} = require('./utils/user');

var users = new User();
const publicPath = path.join(__dirname , '../public');

const port = process.env.PORT || 3004;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
//setup the server to serve static files from the public folder
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://sahil:reversechat1@ds261116.mlab.com:61116/pointfivebn',(err)=>{
    if(err) return console.log('connection error');
});
app.use(express.static(publicPath));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
// app.set('view engine','ejs');

app.use(validator());
app.use(session({
    secret: 'thisisasecretkey',
    resave: true,
    saveUninitialized : false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

require('./utils/facebook_passport');

app.get('/auth/facebook', 
    passport.authenticate('facebook',{
        scope: 'email'
    }),
);
app.get('/auth/facebook', 
    passport.authenticate('facebook',{
        scope: 'email'
    }),
);

app.get('/auth/facebook/callback',(req,res)=> passport.authenticate('facebook',{
    successRedirect : `/${req.param.name}`,
    failureRedirect : '/',
    failureFlash : true
}));


io.on('connection' , (socket) => {
   console.log('new user connected with id ::' , socket.id);
   socket.on('join', (param,callback) => {

        if(!isRealString(param.name)){
           return  callback({message:'invalid name'});
        }

        socket.join("reversechat");
        // Add the new user to reversechat room
        users.removeUser(socket.id);
        users.addUser(socket.id,param.name,"reversechat");

        io.to("reversechat").emit('updateUserList',users.getUserList("reversechat"))

        socket.emit('newMessage',generateMessage('Reverse bot',`Hi ${param.name} Welcome to reversechat`));
    
        socket.broadcast.to("reversechat").emit('newMessage',generateMessage('Reverse bot',`Hi ${param.name} welcome to reversechat"`));

        callback();

   });

   socket.on('createMessage', (message,callback) => {

        var currentUser = users.getUser(socket.id);

        if(currentUser && isRealString(message.text))
        {
            console.log(`${currentUser.name} just created a message which is now being broadcasted`);
            
            io.to("reversechat").emit('newMessage',generateMessage(currentUser.name,message.text));
            io.to("reversechat").emit('newMessage',generateMessage('Reverse bot',`${message.text.split(" ").reverse().join(" ")}`));
    
            // socket.broadcast.to("reversechat").emit('newMessage',generateMessage('Reverse bot',`${message.text.split(" ").reverse().join(" ")}`));
    
            // io.to("reversechat").emit('newMessage',generateMessage('Reverse bot',`${message.text.split(" ").reverse().join(" ")}`));
            return callback();
        }
        callback('error');
      
   });

   socket.on('disconnect' , () =>{
        var user = users.removeUser(socket.id);

        if(user){

            io.to("reversechat").emit('updateUserList',users.getUserList("reversechat"));
            socket.broadcast.to("reversechat").emit('newMessage',generateMessage('Reverse bot',`${user.name} has left the room`));

        }
        console.log('Client Disconnected ');
   });

});


server.listen(port , (err) => {
    if(err) return console.log(err);

    console.log(`server started at port ${port}`);
});
