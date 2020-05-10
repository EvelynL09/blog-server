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
  			throw err;
  		}
  		if(resContent == null){
			res.status(401);
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
									throw err;
								}
  								//console.log(token);
  								res.cookie('jwt', token);

  								//redirect
  								if(givenRedirect){
  									res.redirect(givenRedirect);
  								}
  								else{
  									//set status code and response body
  									res.status(200).send("The authentication was successful");
  								}
					});
					// end sign


				}
				// unsuccess
				else{
					res.status(401);
					res.render('login', {username: "", password: "", redirect: ""});
				}
			});

		}


	});
})

module.exports = router;