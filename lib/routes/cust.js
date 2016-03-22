var express = require('express'),
	router = express.Router(),
	cust = require('../serv/cust'),
	convert= require("../util/convert");
router.get('/types', function(req, res) {
	cust.types(convert.resp(res));
});
router.get('/', function(req, res) {
  cust.list(req.session.user, req.query, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
router.post('/', function(req, res) {
  cust.addNUpdate(req.session.user, req.body, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
router.put('/:id', function(req, res) {
  req.body.id=req.params.id;
  cust.addNUpdate(req.session.user, req.body, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
router.delete('/:id', function(req, res) {
  cust.del(req.session.user, req.params.id, convert.resp(res));
});
module.exports = router;