//native modules
const path = require('path');

//external modules
const express = require('express');

var app = express();
const publicPath = path.join(__dirname , '../public');
const port = process.env.PORT || 3000;


app.use(express.static(publicPath));

app.listen(port , (err) => {
    if(err) return console.log(err);

    console.log(`server started at port ${port}`);
});
