let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let client = require('../db');
let jwt = require('jsonwebtoken');


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
			console.log("Database FindOne Error.");
  			res.sendStatus(400);
  		}
		//If the records do not match,
  		if(resContent == null){
			//the server must return the status code “401 (Unauthorized)”
			res.status(401);
			//and an HTML form with username and password input fields in the response body.
			res.render('login', {username: givenUsername, password: givenPassword, redirect: givenRedirect});
  		}
		// Set an authentication session cookie in JSON Web Token (JWT)
		else{
			let dbPassword = resContent.password;
			bcrypt.compare(givenPassword, dbPassword, function(err, ifMatched) {
				if(err){
					console.log("Bcrypt Compare Error.");
		  			res.sendStatus(400);
				}
				// password correct. success
				if(ifMatched){
					let secretKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
					let expiration = Math.floor(Date.now() / 1000) + 2*(60 * 60);//2hrs
					// let expiration = Math.floor(Date.now() / 1000) + 2*(0.5 * 60);//1min

					//start sign
					jwt.sign({"exp": expiration, "usr": givenUsername}, // payload
						     secretKey,
						     {header: {"alg": "HS256", "typ": "JWT" }},
						     function(err, token) { //header
							 	//inside sign
								if(err){
									console.log("JWT Sign Error.");
						  			res.sendStatus(400);
								}
  								//console.log(token);
  								res.cookie('jwt', token);

  								//redirect to redirect if it was provided in the request or
  								if(givenRedirect){
  									res.redirect(givenRedirect);
  								}
  								else{
									//return status code “200 (OK)” with the body saying that the authentication was successful.
  									res.status(200).send("The authentication was successful");
  								}
					});
					// end sign
				}
				// unsuccess
				else{
					//the server must return the status code “401 (Unauthorized)”
					res.status(401);
					//and an HTML form with username and password input fields in the response body.
					res.render('login', {username: givenUsername, password: givenPassword, redirect: givenRedirect});
				}
			});

		}


	});
})

module.exports = router;