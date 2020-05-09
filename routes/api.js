let express = require('express');
let router = express.Router();
let client = require('../db');


router.get('/:username', function (req, res, next) {

})

router.get('/:username/:postid', function(req, res, next){

})

// the server should insert a new blog post with username, postid, title, and body from the request.
router.post('/:username/:postid', function(req, res, next){
//If a blog post with the same postid by username already exists in the server, the server should not insert a new post and reply with “400 (Bad request)” status code.
    const currTime = new Date();
    const username = req.params.username;
    const postid = req.params.postid;
    const {title, body} = req.body;

    if(title === undefined || body === undefined){
        res.status(400)
		//TODO: better error page
		res.render('error', { message: 'The request must include title and body in its body in JSON.', error: {status: "Error Code: 400", stack:req.body}});
    }
    else{
        //The created and modified fields of the inserted post should be set to the current time.
        console.log(currTime.getTime())
	    let collection = client.dbCollection('BlogServer', 'Posts');
        let postJSON =  { "postid": postid, "username": username, "created": currTime.getTime(), "modified": currTime.getTime(), "title": title, "body": body };
        //TODO: what does w:1 mean?  https://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html
        collection.insertOne(postJSON, {w: 1}, function(err, record){
            //insert a record with an existing _id value, then the operation yields in error.
      		if(err){
                res.sendStatus(400);
      		}
            //If the insertion is successful, the server should reply with “201 (Created)” status code.
            console.log("Record added as "+record.postid);
            res.sendStatus(201);
        });

    }
})

router.put('/:username/:postid', function(req, res, next){

})

router.delete('/:username/:postid', function(req, res, next){

})






module.exports = router;