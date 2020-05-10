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
	if(givenUsername==null||isNaN(givenPostid)){
		res.status(400);
		res.send("Missing Username or Invalid postid");
	}
	else{

		// markdown initialization
		let reader = new commonmark.Parser();
		let writer = new commonmark.HtmlRenderer();

	  	// Find some documents with certain conditions
		let collection = client.dbCollection('BlogServer', 'Posts');
	  	collection.findOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
	  		if(err){
                console.log("Database FindOne Error");
                res.sendStatus(400);
	  		}
			//Return status code 404 for the above routes if either the :username or :postid does not exist in the database.
	  		if(resContent == null){
				res.status(404);
				res.render('error', { message: 'Username or Postid not found!', error: {status: "Error Code: 404", stack:""}});
	  		}
			else{
		  		let parsedTitle = reader.parse(resContent.title);
		  		let resTitle = writer.render(parsedTitle);
		  		let parsedBody = reader.parse(resContent.body);
		  		let resBody = writer.render(parsedBody);

				let ctime = new Date(resContent.modified);
				let mtime = new Date(resContent.modified);
		  		res.render('blog', { username: givenUsername, id: givenPostid, title: resTitle, body: resBody, created: ctime.toString().substring(0,24), modified: mtime.toString().substring(0,24) });
			}
		});
	}

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
	//find posts with given username and starting from postid="start" order by postid
  	collection.find({"username":givenUsername, "postid":{$gte:start}},{"sort":"postid"}).toArray(function(err, resContent) {
  		if(err){
            console.log("Database Find Error");
            res.sendStatus(400);
  		}
		//Return status code 404 for the above routes if either the :username or :postid does not exist in the database.
  		if(resContent.length == 0){
			res.status(404);
			res.render('error', { message: 'Username not found or Invalid number for start query!', error: {status: "Error Code: 404", stack:""}});
  		}
		else{
	 		let resTitle = [];
	 		let resBody = [];
			let resCreated = [];
			let resModified = [];
			let next_id = 0;

  			for(let i = 0; (i < 5) && (i < resContent.length); i++){
  				let parsedTitle = reader.parse(resContent[i].title);
  				let curTitle = writer.render(parsedTitle);
  				let parsedBody = reader.parse(resContent[i].body);
  				let curBody = writer.render(parsedBody);
  				resTitle.push(curTitle);
  				resBody.push(curBody);
    			let time = new Date(resContent[i].modified);
				resModified.push(time.toString().substring(0,24));
				time = new Date(resContent[i].created);
				resCreated.push(time.toString().substring(0,24));
	  		}

			if(resContent.length > 5){
				next_id = resContent[5].postid;
			}

	  		res.render('blogsList', { username: givenUsername, nextId: next_id, title: resTitle, body: resBody, created: resCreated, modified: resModified });
		}

	});
})

module.exports = router;
