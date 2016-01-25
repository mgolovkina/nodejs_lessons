var read = require("read");
read({ prompt : 'What is your name?'}, function(err, name){
	console.log('Hello, ' + name);
});