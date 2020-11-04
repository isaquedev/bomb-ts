var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.listen(PORT);
console.log('running in: http://localhost:' + PORT)