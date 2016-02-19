var scraperjs = require("scraperjs");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/noti',  {server:{auto_reconnect:true}});

//Entrada is a model
var Entrada = mongoose.model('Entrada', require('./entrada'));
//var urlCrawl = 'http://www.un.org/spanish/News/latest-headlines.asp';
var urlCrawl = 'http://localhost:8008/test.html';

var entriesToSave = 0;
var foundNews = 0;
var oldNews = 0;

scraperjs.StaticScraper.create(urlCrawl)
    .scrape(function($) {
        return $("p a").map(function() {
            return $(this);
        }).get();
    })
    .then(function(news) {
        listArray(news); 
    });

function completa(url){
	return 'http://www.un.org' + url;
}

function codigo(url){
	return url.split("=")[1];
}

function handleError(err){
	console.error("Error: " + err); 
	return 1; //error
}

function tryCloseMongo(){
	if (entriesToSave <= 0){
  	console.log("disconnect from mongo, entriesToSave: " + entriesToSave);
		mongoose.disconnect();
		return 0;
  }
}

function listArray(news){
	foundNews = news.length-1; //el de mas noticias
	console.log("Found news: " + foundNews);
	news.forEach(function(val){

		var ent = new Entrada({
			title: val.text(),
			link: completa(val.attr('href')),
			code: codigo(val.attr('href'))
		});

		//let's see if the code is saved already
		var query  = Entrada.where({ code: ent.code });
		query.findOne(function (err, entry) {
		  if (err) return handleError(err);
		  if (!entry && ent.code !== undefined) { //if not found
		    // doc may be null if no document matched
		    console.log("Let's save " + (++entriesToSave) + " " + ent.title + " " + ent.code);
		    ent.save(function (err) {
				  if (err) return handleError(err);
				  
				  --entriesToSave;
				  tryCloseMongo();
				});
		  } else if (entry){
		  	console.log("Old news: " + (++oldNews));
		  	if (oldNews == foundNews){ //nothing new
		  		tryCloseMongo();
		  	}
		  }
		});

		
	});

	//tryCloseMongo();
	return 0;
}

