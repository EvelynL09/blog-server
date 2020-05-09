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
	res.send(givenRedirect);
})

module.exports = router;