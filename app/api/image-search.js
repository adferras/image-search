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

  function simplify(record){
    return {
      "term": record.term,
      "timestamp": record.timestamp
    };
  }

  function getHistory(db, res){
    var jsonData = [];
    console.log("Getting history");
    var cursor = db.collection('history').find().toArray(function(err, result) {
      console.log('result:');
      console.log(result);
      res.send(result);
    
    });
    //console.log(cursor[0]);
    //console.log(JSON.stringify(cursor));
    //cursor.each(function(err, doc) {
    //  if (doc !== null) {
    //    var simple = simplify(doc);
    //    console.log(typeof simple);
    //    console.log(simple);
    //    console.log(JSON.parse(simple));
    //    jsonData.push(simple);
    //  }
    //});
    //console.log(jsonData);
    //res.send('results');
//        res.send(resp.map(listify));
  }

  /*
  var findRestaurants = function(db, callback) {
     var cursor =db.collection('restaurants').find( );
     cursor.each(function(err, doc) {
           assert.equal(err, null);
           if (doc != null) {
                    console.dir(doc);
                 } else {
                          callback();
                       }
        });
  };
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
