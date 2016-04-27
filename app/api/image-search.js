/*jslint node: true */
'use strict';
var Imgur = require('imgur-search');

module.exports = function (app) {

	app.route('/api/imagesearch/:query')
    .get(function(req, res){
      var query = req.params.query;
      console.log("Query: " + query);
      var page = req.query.offset || null;
      console.log("Page: " + page);
      var imgur = new Imgur(process.env.IMGUR_CLIENT_ID);
      var results = imgur.search(query, page).always(function(resp){
        console.log("Number of results: " + resp.length);
        res.send(resp.map(listify));
      
      });
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
};
