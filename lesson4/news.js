'use strict'

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const templating = require('consolidate');
app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + ''); // + '/views'

const request = require('request');
const urlutils = require('url');
const cheerio = require('cheerio');

const TITLE = "Сервис информационной подборки";
const COOKIES_MAX_AGE = 24 * 3600000;
var h_checked = '';
var m_checked = '';
var g_checked = '';

function define_news_param(param)
{
	h_checked = '';
	m_checked = '';
	g_checked = '';

	if (param && param.source)
	{
		if (param.source == 'megamozg.ru')
			m_checked = 'checked';
		else if (param.source == 'geektimes.ru')
			g_checked = 'checked';
		else 
			h_checked = 'checked';
	}
	else 
	{
		h_checked = 'checked';
	}
}

app.get('/', function(req, res){

	define_news_param(req.cookies);

	res.render('news', {
		title: TITLE,
		num: (req.cookies.news_number) ? req.cookies.news_number : 5,
		h_checked: h_checked,
		m_checked: m_checked,
		g_checked: g_checked
	});
});

app.post('/', function(req, res){

		if (!req.body) 
			return res.sendStatus(400);

		var url = urlutils.format({
			protocol: 'https',
			hostname: req.body.source,
			pathname: '/'
		});

		define_news_param(req.body);
		res.cookie('source', req.body.source, {maxAge: COOKIES_MAX_AGE});
		res.cookie('news_number', req.body.news_number, {maxAge: COOKIES_MAX_AGE});

		request.get({
				url: url
			}, function (error, response, html) {
				var data = {};

				if (error || response.statusCode != 200) {
					data = {
						title: TITLE,
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
						title: TITLE,
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