var fs = require('fs');

if (!process.argv[2])	{
	console.error('Input file is not defined');
	console.error('Usage: analyzer.js <filename>');
	return;
}

fs.readFile(process.argv[2], function(err, data) {
	if (err) throw err;
	
	var results = data.toString();
	var wins = 0;
	var losses = 0;
	var prev;
	var wins_max = 0;
	var losses_max = 0;
	var counter = 0;

	for (var i = 0; i < results.length; i++) {
		if (results[i] == '0') 
			losses++;
		else 
			wins++;

		if (prev != results[i]) {
			if (prev == '0' && losses_max < counter) 
				losses_max = counter;
			else if (prev == '1' && wins_max < counter) 
				wins_max = counter;
			
			counter = 1;
		}
		else
			counter++

		prev = results[i];
	};

	console.log('Rounds: ' + results.length);
	console.log('Wins: ' + wins);
	console.log('Losses: ' + losses);
	console.log('Wins ratio: ' + ((wins/losses).toFixed(2) * 100) + '%');
	console.log('Max wins: ' + wins_max);
	console.log('Max losses: ' + losses_max);
});