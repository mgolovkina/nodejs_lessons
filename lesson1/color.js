var chalk = require('chalk');
var beep = require('beepbeep');

setInterval(function(){

	var color = Math.floor(Math.random() * 8);
	var text = 'Some text';
	switch(color)
	{
		case 0: 
			text = chalk.red(text);
			break;
		case 1: 
			text = chalk.blue(text);
			break;
		case 2: 
			text = chalk.green(text);
			break;
		case 3: 
			text = chalk.gray(text);
			break;
		case 4: 
			text = chalk.yellow(text);
			break;
		case 5: 
			text = chalk.cyan(text);
			break;
		case 6: 
			text = chalk.magenta(text);
			break;
		default: 
			text = chalk.white(text);
	}
	beep();
	console.log(text);

}, 2000);