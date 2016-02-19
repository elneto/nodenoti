var scraperjs = require("scraperjs");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/noti');

//Entrada is a model
var Entrada = mongoose.model('Entrada', require('./entrada'));
//var urlCrawl = 'http://www.un.org/spanish/News/latest-headlines.asp';
var urlCrawl = 'http://localhost:8008/test.html';

scraperjs.StaticScraper.create(urlCrawl)
    .scrape(function($) {
        return $("p a").map(function() {
        	//console.log($(this));
            //return $(this).text();
            return $(this);
        }).get();
    })
    .then(function(news) {
        //console.log(news);
        listArray(news); 
    });

function completa(url){
	return 'http://www.un.org' + url;
}

function codigo(url){
	return url.split("=")[1];
}

function listArray(news){
	news.forEach(function(val){
		/*console.log("title: " + val.text());
		console.log("link: " + completa(val.attr('href')));
		console.log("code: " + codigo(val.attr('href')));*/

		var ent = new Entrada({
			title: val.text(),
			link: completa(val.attr('href')),
			code: codigo(val.attr('href'))
		});

		console.log(ent);
	});
}

