var http = require('http');
var urlutils = require('url');
var request = require('request');

var yandex_key = 'trnsl.1.1.20160204T130647Z.b1c8dac7469a844e.d59d7ee860a94073f384ad279640c1a4f163ba51';
var link_templ = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + yandex_key + '&lang=en-ru' + '&text='; 

http.createServer(function(req, res){
	var params = urlutils.parse(req.url, true).query;
	var link = link_templ + params.word;

	res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});

	request(link, function(err, response, body){
		if (!err && response.statusCode == 200)
		{
			res.write(JSON.parse(body).text[0]);
			res.end();
		}
	});

}).listen(5000);

console.log('Server has started!');