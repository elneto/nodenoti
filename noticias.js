var scraperjs = require("scraperjs")

scraperjs.StaticScraper.create('http://www.un.org/spanish/News/latest-headlines.asp')
    .scrape(function($) {
        return $("p a").map(function() {
        	console.log($(this));
            return $(this).text();
        }).get();
    })
    .then(function(news) {
        console.log(news);
    })