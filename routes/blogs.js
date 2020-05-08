// var express = require('express');
let express = require('express');
let router = express.Router();
let commonmark = require('commonmark');
let MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/:username/:postid', function (req, res) {
	// parameters 
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);


	// markdown initialization
	let reader = new commonmark.Parser();
	let writer = new commonmark.HtmlRenderer();

	// db initialization
	let url = 'mongodb://localhost:27017';

	// db connection
	MongoClient.connect(url, function(err, client) {
		let db = client.db('BlogServer');

		//Get the markdown body and title using mongodb
 		// Get the documents collection
  		let collection = db.collection('Posts');

  		// Find some documents with certain conditions
  		collection.findOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
  			if(err){
  				throw err;
  			}
  			if(resContent == null){
  				res.send("Not Matched Username and Postid!");
  			}

  			let parsedTitle = reader.parse(resContent.title);
  			let resTitle = writer.render(parsedTitle);
  			let parsedBody = reader.parse(resContent.body);
  			let resBody = writer.render(parsedBody);
  			//res.send(resTitle);
  			res.render('blogs', { username: givenUsername, id: givenPostid, title: resTitle, body: resBody });
  		});

  		client.close();
	});
    


})

router.get('/:username', function (req, res) {
	// parameters 
	let givenUsername = req.params.username;


	// markdown initialization
	let reader = new commonmark.Parser();
	let writer = new commonmark.HtmlRenderer();

	// db initialization
	let url = 'mongodb://localhost:27017';

	// db connection
	MongoClient.connect(url, function(err, client) {
		let db = client.db('BlogServer');

		//Get the markdown body and title using mongodb
 		// Get the documents collection
  		let collection = db.collection('Posts');

  		// Find some documents with certain conditions
  		collection.find({"username":givenUsername}).toArray(function(err, resContent) {
  			if(err){
  				throw err;
  			}
  			if(resContent == null){
  				res.send("Not Matched Username and Postid!");
  			}

  			let resTitle = [];
  			let resBody = [];

  			for(let i = 0; i<resContent.length; i++){
  				let parsedTitle = reader.parse(resContent[i].title);
  				let curTitle = writer.render(parsedTitle);
  				let parsedBody = reader.parse(resContent[i].body);
  				let curBody = writer.render(parsedBody);
  				resTitle.push(curTitle);
  				resBody.push(curBody);
  				if(i==4){
  					break;
  				} 
  			}

  			res.render('blogList', { username: givenUsername, title: resTitle, body: resBody });
  			
  		});
  		client.close();

	});
}

module.exports = router;
