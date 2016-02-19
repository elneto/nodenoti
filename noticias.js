var scraperjs = require("scraperjs");
var mongoose = require("mongoose");

//mongoose.connect('mongodb://localhost:27017/noti');

//Entrada is a model
//var Entrada = mongoose.model('Entrada', require('./entrada'));

scraperjs.StaticScraper.create('http://www.un.org/spanish/News/latest-headlines.asp')
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
	news.forEach(function(val, index){
		console.log("title: " + val.text());
		console.log("href: " + completa(val.attr('href')));
		console.log("codigo: " + codigo(val.attr('href')));
	});
}