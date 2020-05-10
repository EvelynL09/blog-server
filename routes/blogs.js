// var express = require('express');
let express = require('express');
let router = express.Router();
let commonmark = require('commonmark');
let client = require('../db');

/* GET home page. */
router.get('/:username/:postid', function (req, res, next) {
	// parameters
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);


	// markdown initialization
	let reader = new commonmark.Parser();
	let writer = new commonmark.HtmlRenderer();

  	// Find some documents with certain conditions
	let collection = client.dbCollection('BlogServer', 'Posts');
  	collection.findOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
  		if(err){
  			throw err;
  		}
  		if(resContent == null){
			res.status(404);
			//TODO: better error page
			res.render('error', { message: 'Username or Postid not found!', error: {status: "Error Code: 404", stack:""}});
  		}
		else{
	  		let parsedTitle = reader.parse(resContent.title);
	  		let resTitle = writer.render(parsedTitle);
	  		let parsedBody = reader.parse(resContent.body);
	  		let resBody = writer.render(parsedBody);
	  		res.render('blogs', { username: givenUsername, id: givenPostid, title: resTitle, body: resBody });
		}


	});



})

router.get('/:username', function (req, res, next) {
	// parameters
	let givenUsername = req.params.username;
	// /blog/cs144?start=3
	let start = req.query.start ? parseInt(req.query.start) : 1;
	// markdown initialization
	let reader = new commonmark.Parser();
	let writer = new commonmark.HtmlRenderer();

  	// Find some documents with certain conditions
	let collection = client.dbCollection('BlogServer', 'Posts');
  	collection.find({"username":givenUsername, "postid":{$gte:start}},{"sort":"postid"}).toArray(function(err, resContent) {
  		if(err){
  			throw err;
  		}
  		if(resContent.length == 0){
			res.status(404);
			//TODO: better error page
			res.render('error', { message: 'Username not found or Invalid number for start query!', error: {status: "Error Code: 404", stack:""}});
  		}
		else{
	 		let resTitle = [];
	 		let resBody = [];
			let next_id = 0;

  			for(let i = 0; (i < 5) && (i < resContent.length); i++){
  				let parsedTitle = reader.parse(resContent[i].title);
  				let curTitle = writer.render(parsedTitle);
  				let parsedBody = reader.parse(resContent[i].body);
  				let curBody = writer.render(parsedBody);
  				resTitle.push(curTitle);
  				resBody.push(curBody);
	  		}

			if(resContent.length > 5){
				next_id = resContent[5].postid;
			}

	  		res.render('blogsList', { username: givenUsername, nextId: next_id, title: resTitle, body: resBody });
		}

	});
})

module.exports = router;
