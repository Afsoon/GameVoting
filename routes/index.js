var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/team1', function(req, res, next){
  res.render('inputTeam1', { title: 'team1'} );
});

module.exports = router;
