var request = require('request');
var cheerio = require('cheerio');
var http = require('http');

http.createServer(function(req, res){
	res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});

	request('https://habrahabr.ru/', function(err, response, html){
		if (!err && response.statusCode == 200)
		{
			var $ = cheerio.load(html);
			$('div.shortcuts_item').each(function(i, elem){
				$(this).find('.content .buttons').remove();
				$(this).find('.content img').remove();

				res.write('<div style="margin: 40px">');
				res.write('<h2><a href="' + $(this).find('.title a').attr('href') + '">' 
							+ $(this).find('.title a').text() + '</a></h2>');
				res.write('<p><em>Дата: ' + $(this).find('.published').text() + '</em></p>');
				res.write('<p>' + $(this).find('.content') + '</p>');
				res.write('</div>');
			});
			res.end();
		}
	});

}).listen(5000);

console.log('Server has started!');