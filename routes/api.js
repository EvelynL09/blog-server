let express = require('express');
let router = express.Router();
let client = require('../db');


router.get('/:username', function (req, res, next) {

})

router.get('/:username/:postid', function(req, res, next){

})

// the server should insert a new blog post with username, postid, title, and body from the request.
router.post('/:username/:postid', function(req, res, next){
    const currTime = new Date();
    const username = req.params.username;
    const postid = parseInt(req.params.postid);
    const {title, body} = req.body;
    //----Request Validation -----------------------------------
    //TODO given Username = null?
    if(username == null || isNaN(postid)){
		res.status(400);
		res.send("Missing Username or Invalid postid");
	}
	//The request must include title and body in its body in JSON.
    else if(title === undefined || body === undefined){
        res.status(400)
		//TODO: better error page
		res.render('error', { message: 'The request must include title and body in its body in JSON.', error: {status: "Error Code: 400", stack:req.body}});
    }
    //-----End of request validation ----------------------------
    //Authentication
    //
    else{
        let collection = client.dbCollection('BlogServer', 'Posts');
      	collection.findOne({"username":username, "postid": postid}, function(err, resContent) {
      		if(err){
                //TODO
      			throw err;
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
})

router.put('/:username/:postid', function(req, res, next){

})

router.delete('/:username/:postid', function(req, res, next){

})






module.exports = router;