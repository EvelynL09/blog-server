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
  			if(resContent == null)
  				res.send("Not Matched Username and Postid!");
  			let parsedTitle = reader.parse(resContent.title);
  			let resTitle = writer.render(parsedTitle);
  			let parsedBody = reader.parse(resContent.body);
  			let resBody = writer.render(parsedBody);
  			//res.send(resTitle);
  			res.render('blogs', { username: givenUsername, id: givenPostid, title: resTitle, body: resBody });
  		});
  		/*
  		collection.find({"username":givenUsername, "postid":givenPostid}).toArray(function(err, resContent) {
  			res.send(resContent[0].title);
  			
  		});*/

  		//client.close();
	});
	

	//let parsedTitle = reader.parse("Title");
	//let parsedBody = reader.parse("Body");
	//let resTitile = writer.render(parsedTitle);
	//let resBody = writer.render(parsedBody);
    
    


})

router.get('/:username', function (req, res) {
    res.render('blogs', { username: req.params.username, id: "Hi, I am ID" });
})

module.exports = router;
