/*jslint node: true */
'use strict';
var Imgur = require('imgur-search');

module.exports = function (app, db) {

	app.route('/api/imagesearch/:query')
    .get(function(req, res){
      var query = req.params.query;
      var page = req.query.offset || 0;
      var imgur = new Imgur(process.env.IMGUR_CLIENT_ID);
      var results = imgur.search(query, 'top', page).always(function(resp){
        var listified = resp.map(listify);
        if(query !== 'favicon.ico'){
          res.send(listified);
          saveQuery(query, db);
        }
      });
    });

  app.route('/api/latest/imagesearch/')
    .get(function(req, res){
      var foo = getHistory(db, res);
    });

  function getHistory(db, res){
    var cursor = db.collection('history').find({}, {term: 1, timestamp: 1, _id: 0}).sort({ timestamp: -1 }).limit(10).toArray(function(err, result) {
      var formatted = result.map(simplify);
      res.send(formatted);
    });
  }

  function listify(image){
    return {
      "url": image.link,
      "snippet": image.title,
      "thumbnail": thumbnailify(image.link),
      "context": contextify(image.id)
    };

    function contextify(id){
      return 'http://imgur.com/gallery/' + id;
    }

    function thumbnailify(link){
      return link.replace(/(.jpg)/, 's.jpg');
    }
  }

	function saveQuery(term, db){
		var history = db.collection('history');
		history.save({ term: term, timestamp: new Date() }, function(err, result){
			if(err) throw err;
		});
	}

  function simplify(record){
    return {
      "term": record.term,
      "timestamp": record.timestamp
    };
  }
};
