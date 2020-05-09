let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let client = require('../db');


router.get('/', function (req, res, next) {
	let givenUsername = req.query.username;
	let givenPassword = req.query.password;
	let givenRedirect = req.query.redirect;
	res.render('login', { username: givenUsername, password: givenPassword, redirect: givenRedirect });

})


router.post('/', function (req, res, next){
	let givenUsername = req.body.username;
	let givenPassword = req.body.password;
	let givenRedirect = req.body.redirect;
	let collection = client.dbCollection('BlogServer', 'Users');

	
	collection.findOne({"username":givenUsername}, function(err, resContent) {
  		if(err){
  			throw err;
  		}
  		if(resContent == null){
			res.status(401);
			//TODO: check if needed parameters
			res.render('login', {username: "", password: "", redirect: ""});
  		}
		else{
			let dbPassword = resContent.password;
			bcrypt.compare(givenPassword, dbPassword, function(err, ifMatched) {
				if(err){
					throw err;
				}
				// password correct. success
				
				if(ifMatched){
					res.send("Correct password");

				}
				// unsuccess
				else{
					res.send("unsuccess");

				}

			});
			

		}


	});
})

module.exports = router;