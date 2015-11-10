var express = require('express');
var path = require('path');
var router = express.Router();
var pathPublic = path.join(__dirname, '/../public/');
var root = {root: pathPublic};

/* GET home page. */
router.use(express.static(pathPublic));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/team1', function(req, res){
  res.sendFile('inputTeam1.html', root);
});

router.get('/team2', function(req, res){
  res.sendFile('inputTeam2.html', root);
});

router.get('/control', function(req, res){
  res.sendFile('controlPanel.html', root);
});

router.get('/score', function(req, res){
  res.sendFile('scoreboard.html', root);
});


module.exports = router;
