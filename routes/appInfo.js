var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({
      appName: 'Mygrant',
      client: 'Gallyciadas',
      company: 'cubicon',
      year: 2018
  });
});

module.exports = router;
