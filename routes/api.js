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
		res.status(404);
 		//res.json(result);
		res.send("Miss Username");

	}
	else{
		
		let ifValidate = await checkValidation(req, res);
		if(ifValidate){
			console.log("validate");
			let collection = client.dbCollection('BlogServer', 'Posts');
			collection.find({"username":givenUsername}).toArray(function(err, resContent) {
  				if(err){
  					throw err;
  				}
  				if(resContent.length == 0){
  					console.log("No posts for this user");
  					//???????????????????
					res.status(404);
					//TODO: better error page
					res.render('error', { message: 'Username not found!', error: {status: "Error Code: 404", stack:""}});
  				}
				else{
					res.status(200).json(resContent);
				}
			});
		}

	}

})

router.get('/:username/:postid', async function(req, res, next){
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);
	if(givenUsername==null||isNaN(givenPostid)){
		res.status(404);
 		//res.json(result);
		res.send("Miss Username or Miss/Invalid postid");

	}
	else{
		
		let ifValidate = await checkValidation(req, res);
		if(ifValidate){
			console.log("validate");
			let collection = client.dbCollection('BlogServer', 'Posts');
			collection.findOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
  				if(err){
  					throw err;
  				}
  				if(resContent==null){
  					console.log("No such posts for this user");
  					//???????????????????
					res.status(404);
					//TODO: better error page
					res.render('error', { message: 'No such post for this user', error: {status: "Error Code: 404", stack:""}});
  				}
				else{
					res.status(200).json(resContent);
				}
			});
		}

	}

})


router.post('/:username/:postid', function(req, res, next){

})

router.put('/:username/:postid', function(req, res, next){

})

router.delete('/:username/:postid', async function(req, res, next){
	let givenUsername = req.params.username;
	let givenPostid = parseInt(req.params.postid);
	if(givenUsername==null||isNaN(givenPostid)){
		res.status(404);
 		//res.json(result);
		res.send("Miss Username or Miss/Invalid postid");
	}
	else{
		
		let ifValidate = await checkValidation(req, res);
		if(ifValidate){
			console.log("validate");
			let collection = client.dbCollection('BlogServer', 'Posts');
			collection.deleteOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
  				if(err){
  					throw err;
  				}
  				if(resContent.deletedCount==1){
  					console.log("Deleted Successfully");
					res.sendStatus(204);
					
  				}
				else{
					res.sendStatus(400);
				}
			});
		}

	}

})






module.exports = router;