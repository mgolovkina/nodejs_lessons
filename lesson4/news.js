var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser());

var templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + ''); // + '/views'

var request = require('request');
var urlutils = require('url');
var cheerio = require('cheerio');

var title = "Сервис информационной подборки";

app.get('/', function(req, res){
	res.render('news', {
		title: title,
		num: 5,
		h_checked: 'checked'
	});
});

app.post('/', function(req, res){

		var url = urlutils.format({
			protocol: 'https',
			hostname: req.body.source,
			pathname: '/'
		});

		var h_checked = '';
		var m_checked = '';
		var g_checked = '';

		if (req.body.source == 'megamozg.ru')
			m_checked = 'checked';
		else if (req.body.source == 'geektimes.ru')
			g_checked = 'checked';
		else 
			h_checked = 'checked';

		request.get({
				url: url
			}, function (error, response, html) {
				var data = {};

				if (error || response.statusCode != 200) {
					data = {
						title: title,
						error: error,
						num: req.body.news_number,
						h_checked: h_checked,
						m_checked: m_checked,
						g_checked: g_checked
					}
				} else {
					var $ = cheerio.load(html);
					var news = {};
					
					$('div.shortcuts_item').each(function(i, elem){
						$(this).find('.content .buttons').remove();
						$(this).find('.content img').remove();

						news[i] = {
							title: $(this).find('.title a').text(),
							link: $(this).find('.title a').attr('href'),
							date: $(this).find('.published').text(),
							content: $(this).find('.content').text()
						};

						if (i + 1 >= req.body.news_number)
							return false;
					});

					data = {
						title: title,
						news: news,
						num: req.body.news_number,
						h_checked: h_checked,
						m_checked: m_checked,
						g_checked: g_checked
					}
				}

				res.render('news', data);
			}
		);
});

app.listen(8080);
console.log('Express server listening on port 8080');