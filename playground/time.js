const moment = require('moment')
var date = moment();
console.log(date.format("h:mm a"));

var createdAt = date.valueOf(); 
console.log(createdAt);
console.log(moment(createdAt));


