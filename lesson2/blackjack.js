var readline = require('readline');
var fs = require('fs');

if (!process.argv[2])	{
	console.warn("Warning: Output file is not defined. The result won't be safed.");
	console.warn('Usage: blackjack.js <filename>\n');
}

function get_card()
{
	var c = Math.floor((Math.random() * 11) + 0.5) + 2;
	var res;
	switch(c) {
		case 10:
			res = ['J', 10];
			break;
		case 11:
			res = ['Q', 10];
			break;
		case 12:
			res = ['K', 10];
			break;
		case 13:
			res = ['A', 11];
			break;
		default:
			res = [c, c];
	}
	return res;
}

var card1 = get_card();
var card2 = get_card();
var sum = card1[1] + card2[1];

console.log('Cards: ' + card1[0] + ' ' + card2[0]);
console.log('Scope: ' + sum);

if (sum == 21)
{
	console.log('You win!');

	if (process.argv[2])
	{
		fs.appendFile(process.argv[2], 1, function(err) {
			if (err) throw err;
		});
	}
	return;
}

var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

rl.question('Do you want to hit? (y/n) ', function(answer) {
	var res = 0;
	if (answer == 'y')
		{
			var card3 = get_card();
			sum += card3[1];
			console.log('Card: ' + card3[0]);
			console.log('Scope: ' + sum);

			if (sum == 21)	{
				console.log('You win!');
				res = 1;
			}
			else	{
				console.log('You lose!');
			}
		}

	if (process.argv[2])
	{
		fs.appendFile(process.argv[2], res, function(err) {
			if (err) throw err;
		});
	}

	rl.close();
});