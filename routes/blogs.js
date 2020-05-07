var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:username/:postid', function (req, res) {
    res.render('blogs', { username: req.params.username, id: req.params.postid });
})

router.get('/:username', function (req, res) {
    res.render('blogs', { username: req.params.username, id: "req.params.postid" });
})

module.exports = router;
