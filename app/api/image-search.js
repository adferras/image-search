/*jslint node: true */
'use strict';
var Imgur = require('imgur-search');

module.exports = function (app, db) {

	app.route('/api/imagesearch/:query')
    .get(function(req, res){
      var query = req.params.query;
      console.log("Query: " + query);
      var page = req.query.offset || 0;
      console.log("Page: " + page);
      var imgur = new Imgur(process.env.IMGUR_CLIENT_ID);
      var results = imgur.search(query, 'top', page).always(function(resp){
        console.log("Number of results: " + resp.length);
        saveQuery(query, db);
        res.send(resp.map(listify));
      });
    });

  app.route('/api/latest/imagesearch/')
    .get(function(req, res){
      var foo = getHistory(db, res);
    });

  function listify(image){
    return {
      "url": image.link,
      "snippet": image.title,
      "thumbnail": thumbnailify(image.link),
      "context": contextify(image.id)
    };

    function thumbnailify(link){
      return link.replace(/(.jpg)/, 's.jpg');
    }

    function contextify(id){
      return 'http://imgur.com/gallery/' + id;
    }
  }

	function getHistory(db, res){
    console.log("Getting history");
		var history = db.collection('history');
    history.findOne({"term" : "denver"}, function(err, result){
			if(err) throw err;
			if(result){
				res.send("got results");
			} else {
				res.send({ "error" : "No record found" });
			}
    });


		//res.send(history.find());//.sort({ timestamp: 1 }).limit( 10 );
  }

  /*
	function findLink(link, db, res){
		var links = db.collection('links');
		links.findOne({ "short_url" : link }, function(err, result){
			if(err) throw err;
			if(result){
				res.redirect(result.original_url);
			} else {
				res.send({ "error" : "No record found" });
			}
		});
	}
  */

	function saveQuery(term, db){
    console.log("Saving query");
		var history = db.collection('history');
		history.save({ term: term, timestamp: Date.now() }, function(err, result){
			if(err) throw err;
			console.log('Saved: ' + term);
		});
	}
};
