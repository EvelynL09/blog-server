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
	let ifValidate = await checkValidation(req, res);
	if(ifValidate){
    	let givenUsername = req.params.username;
    	if(givenUsername==null){
    		res.status(400);
    		res.send("Missing Username");
    	}
    	else{
			let collection = client.dbCollection('BlogServer', 'Posts');
			collection.find({"username":givenUsername}).toArray(function(err, resContent) {
  				if(err){
					console.log("Database find error in api get");
		    		res.sendStatus(400);
  				}
				res.status(200).json(resContent);
			});
    	}
	}
})

router.get('/:username/:postid', async function(req, res, next){
	let ifValidate = await checkValidation(req, res);
	if(ifValidate){
    	let givenUsername = req.params.username;
    	let givenPostid = parseInt(req.params.postid);
    	if(givenUsername==null||isNaN(givenPostid)){
    		res.status(400);
    		res.send("Missing Username or Invalid postid");
    	}
    	else{
			let collection = client.dbCollection('BlogServer', 'Posts');
			collection.findOne({"username":givenUsername, "postid": givenPostid}, function(err, resContent) {
  				if(err){
  					console.log("database findOne error in api get");
					res.sendStatus(400);
  				}
  				if(resContent==null){
  					console.log("No such posts for this user");
					res.sendStatus(404);
  				}
				else{
					res.status(200).json(resContent);
				}
			});
		}
	}
})

// the server should insert a new blog post with username, postid, title, and body from the request.
router.post('/:username/:postid', async function(req, res, next){
	let ifValidate = await checkValidation(req, res);
	if(ifValidate){

        const currTime = new Date();
        const username = req.params.username;
        const postid = parseInt(req.params.postid);
        const {title, body} = req.body;
        //----Request Validation -----------------------------------
        //TODO given Username = null?
        if(username == null || isNaN(postid)){
			res.sendStatus(400);
			console.log("Missing Username or Invalid postid");
    	}
    	//The request must include title and body in its body in JSON.
        else if(title === undefined || body === undefined){
			console.log("The request must include title and body in its body in JSON.");
            res.sendStatus(400);
        }
        //-----End of request validation ----------------------------
        else{
            let collection = client.dbCollection('BlogServer', 'Posts');
          	collection.findOne({"username":username, "postid": postid}, function(err, resContent) {
          		if(err){
                    console.log("Database findOne error in api post");
		            res.sendStatus(400);
          		}
                //no existed post with same username and postid, insert the new post
          		if(resContent == null){
                    //The created and modified fields of the inserted post should be set to the current time.
                    let postJSON =  { "postid": postid, "username": username, "created": currTime.getTime(), "modified": currTime.getTime(), "title": title, "body": body };
                    collection.insertOne(postJSON, function(err, record){
                        //insert a record with an existing _id value, then the operation yields in error.
                  		if(err){
                            console.log("Insert Error");
                            res.sendStatus(400);
                  		}
                        //If the insertion is successful, the server should reply with “201 (Created)” status code.
                        console.log("Record added as "+ record);
                        res.sendStatus(201);
                    });
          		}
                //If a blog post with the same postid by username already exists in the server
        		else{
                    //the server should not insert a new post and reply with “400 (Bad request)” status code.
        	  		res.sendStatus(400);
        		}
        	});
        }

    }
})

router.put('/:username/:postid', async function(req, res, next){
	let ifValidate = await checkValidation(req, res);
	if(ifValidate){

    	let givenUsername = req.params.username;
    	let givenPostid = parseInt(req.params.postid);
    	let givenTitle = req.body.title;
    	let givenBody = req.body.body;
    	let currTime = new Date();
    	if(givenUsername==null||isNaN(givenPostid)){
			console.log("Missing Username or Invalid postid");
    		res.sendStatus(400);
    	}
        //The request must include title and body in its body in JSON.
        else if(givenTitle === undefined || givenBody === undefined){
			console.log("The request must include title and body in its body in JSON.");
            res.sendStatus(400);
        }
    	else{
    		let collection = client.dbCollection('BlogServer', 'Posts');
    		collection.updateOne({"username":givenUsername, "postid": givenPostid},
    							 { $set: {"title": givenTitle, "body":givenBody, "modified":currTime.getTime()}},
    							 function(err, resContent) {
      								if(err){
                						console.log("Updated Error");
                        				res.sendStatus(400);
      								}
      								if(resContent.modifiedCount == 1){
      									console.log("Updated successfully");
                						res.sendStatus(200);
      								}
      								else{
      									console.log("Updated fails");
      									res.sendStatus(400);
      								}
    		});
    	}

	}
})

router.delete('/:username/:postid', async function(req, res, next){
	let ifValidate = await checkValidation(req, res);
	if(ifValidate){

    	let givenUsername = req.params.username;
    	let givenPostid = parseInt(req.params.postid);
    	if(givenUsername==null||isNaN(givenPostid)){
			console.log("Missing Username or Invalid postid");
			res.sendStatus(400);
    	}
    	else{
    		let collection = client.dbCollection('BlogServer', 'Posts');
    		collection.deleteOne({"username":givenUsername, "postid": givenPostid},
                                function(err, resContent) {
                    				if(err){
										console.log("Database deleteOne error");
										res.sendStatus(400);
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