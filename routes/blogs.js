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
  		collection.findOne()
  		collection.find({"username":givenUsername, "postid":givenPostid}).toArray(function(err, resContent) {
  			res.send(resContent[0].title);
  			
  		});

  		//client.close();
	});
	

	//let parsedTitle = reader.parse("Title");
	//let parsedBody = reader.parse("Body");
	//let resTitile = writer.render(parsedTitle);
	//let resBody = writer.render(parsedBody);
    //res.render('blogs', { username: givenUsername, id: givenPostid });
    


})

router.get('/:username', function (req, res) {
    res.render('blogs', { username: req.params.username, id: "Hi, I am ID" });
})

module.exports = router;
