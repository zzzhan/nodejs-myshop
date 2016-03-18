var express = require('express'),
	router = express.Router(),
	cust = require('../serv/cust'),
	convert= require("../util/convert");
router.get('/', function(req, res) {
  cust.list(req.session.user, req.query, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
module.exports = router;