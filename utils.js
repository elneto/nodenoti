exports.entriesToSave = 0;
exports.foundNews = 0;
exports.oldNews = 0;

exports.completa = function(url){
	return 'http://www.un.org' + url;
};

exports.codigo = function(url){
	return url.split("=")[1];
};

exports.handleError= function(err){
	console.error("Error: " + err); 
	return 1; //error
};
