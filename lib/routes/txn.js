var express = require('express'),
	router = express.Router(),
	txn = require('../serv/txn'),
	convert= require("../util/convert");
router.post('/', function(req, res) {
  txn.addTxn(req.session.user, req.body, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
router.get('/', function(req, res) {
  txn.list(req.session.user, req.query, function(c, rows){
	res.send(convert.json(c, rows));
  });
});
router.delete('/:id', function(req, res) {
  txn.del(req.session.user, req.params.id, convert.resp(res));
});
module.exports = router;