let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let client = require('../db');


router.get('/', function (req, res) {
	let givenUsername = req.query.username;
	let givenPassword = req.query.password;
	let givenRedirect = req.query.redirect;

})


router.post('/', function (req, res){
	let givenUsername = req.body.username;
	let givenPassword = req.body.password;
	let givenRedirect = req.body.redirect;

})
