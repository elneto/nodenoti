var scraperjs = require("scraperjs");
var mongoose = require("mongoose");
var utils = require("./utils");
var mail = require("./mail");

mongoose.connect('mongodb://localhost:27017/noti',  {server:{auto_reconnect:true}});

//Entrada is a model
var Entrada = mongoose.model('Entrada', require('./entrada'));
var urlCrawl = 'http://www.un.org/spanish/News/latest-headlines.asp';
//var urlCrawl = 'http://localhost:8008/test.html';

scraperjs.StaticScraper.create(urlCrawl)
    .scrape(function($) {
        return $("p a").map(function() {
            return $(this);
        }).get();
    })
    .then(function(news) {
        listArray(news); 
    });

function tryCloseMongo(){
	if (utils.entriesToSave <= 0){
  	console.log("disconnect from mongo, entriesToSave: " + utils.entriesToSave);
		mongoose.disconnect();
		return 0;
  }
}

function listArray(news){
	utils.foundNews = news.length-1; //el de mas noticias
	console.log("Found news: " + utils.foundNews);
	news.forEach(function(val){

		var ent = new Entrada({
			title: val.text(),
			link: utils.completa(val.attr('href')),
			code: utils.codigo(val.attr('href'))
		});

		//let's see if the code is saved already
		var query  = Entrada.where({ code: ent.code });
		query.findOne(function (err, entry) {
		  if (err) return utils.handleError(err);
		  if (!entry && ent.code !== undefined) { //if not found
		    // doc may be null if no document matched
		    console.log("Let's save " + (++utils.entriesToSave) + " " + ent.title + " " + ent.code);
		    ent.save(function (err) {
				  if (err) return utils.handleError(err);

				  --utils.entriesToSave;
				  // setup e-mail data with unicode symbols
					mail.mailOptions = {
					    from: 'Neto News 👥 <yo@ernestoaraiza.com>', // sender address
					    to: 'yo@ernestoaraiza.com, araiza@un.org, moran1@un.org', // list of receivers
					    subject: ent.title + ' ✔', // Subject line
					    text: ent.title + ' ' + ent.link + ' ' +'🐴', // plaintext body
					    html: '<a href="'+ ent.link + '">' + ent.title +' 🐴</a>' // html body
					};
				  mail.send(mail.mailOptions);
				  tryCloseMongo();
				});
		  } else if (entry){
		  	console.log("Old news: " + (++utils.oldNews) + " " + ent.title);
		  	if (utils.oldNews == utils.foundNews){ //nothing new
		  		tryCloseMongo();
		  	}
		  }
		});

		
	});

	//tryCloseMongo();
	return 0;
}

