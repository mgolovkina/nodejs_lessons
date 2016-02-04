var request = require('request');
var cheerio = require('cheerio');

request('https://habrahabr.ru/', function(err, response, html){
	if (!err && response.statusCode == 200)
	{
		var $ = cheerio.load(html);
		$('div.shortcuts_item').each(function(i, elem){
			$(this).find('.content .buttons').remove();
			$(this).find('.content img').remove();

			console.log('Дата: ' + $(this).find('.published').text());
			console.log('Заголовок: ' + $(this).find('.title a').text());
			console.log('Источник: ' + $(this).find('.title a').attr('href'));
			console.log('Содержание: ' + $(this).find('.content').text());
		});
	}
});