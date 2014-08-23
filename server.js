var express = require('express');
var app = express();

app.configure(function() {
  app.use(express.compress());
  app.use(express.static(__dirname + "/build"));
});

var port = process.env.PORT || 1010;
app.listen(port);
console.log('Listening on port ' + port);