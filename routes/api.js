let express = require('express');
let router = express.Router();
let client = require('../db');
let jwt = require('jsonwebtoken');

async function checkValidation(req, res) {

	let myCookie = req.cookies.jwt;
	let resBoolean = false;

	if(myCookie == null){
		res.status(401).send("Cookie Not Found");
		resBoolean=false;
	}
	else{
		let secretKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
		try{
			jwt.verify(myCookie, secretKey, function(err, decoded) {
				if(err){
					throw err;
				}
  				if(decoded.usr!=req.params.username){
  					res.status(401).send('Invalid Cookie: username not matched');
        			resBoolean=false;
  				}
  				// may not need
  				else if(decoded.exp <= Math.floor(Date.now() / 1000)){
  					res.status(401).send('Invalid Cookie: expired cookie');
        			resBoolean=false;
  				}
  				else{
  					console.log("Verified");
  					resBoolean=true;
  				}
			});

		} catch(error){
			res.status(401).send('Invalid Cookie'); //Verification fail or expired
    		return false;
		}	
	}
	
	return resBoolean;
}

router.get('/:username', async function (req, res, next) {
	let givenUsername = req.params.username;
	if(givenUsername==null){
		res.status(200);
 		//res.json(result);
		res.send("Miss Username");

	}
	else{
		
		let ifValidate = await checkValidation(req, res);
		if(ifValidate){
			res.send("validate");
		}

		/*
		let collection = client.dbCollection('BlogServer', 'Posts');
		collection.find({"username":givenUsername}).toArray(function(err, resContent) {
  		if(err){
  			throw err;
  		}
  		if(resContent.length == 0){
			res.status(404);
			//TODO: better error page
			res.render('error', { message: 'Username not found!', error: {status: "Error Code: 404", stack:""}});
  		}
		else{
			res.JSON(resContent);
		}

	});*/
	}
	


	

})

router.get('/:username/:postid', function(req, res, next){
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);

})


router.post('/:username/:postid', function(req, res, next){

})

router.put('/:username/:postid', function(req, res, next){

})

router.delete('/:username/:postid', function(req, res, next){
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);

})






module.exports = router;