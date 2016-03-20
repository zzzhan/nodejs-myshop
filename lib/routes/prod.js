var express = require('express'),
	router = express.Router(),
	prod = require('../serv/prod'),
	convert= require("../util/convert");
router.get('/units', function(req, res) {
	prod.units(convert.resp(res));
});
router.get('/types', function(req, res) {
	prod.types(convert.resp(res));
});
router.get('/', function(req, res) {
	prod.list(convert.resp(res), req.query.q);
});
router.post('/', function(req, res) {
	prod.add(req.session.user, req.body, convert.resp(res));
});
router.put('/:id', function(req, res) {
  prod.upd(req.session.user, req.params.id, req.body, 
    convert.resp(res));
});
router.delete('/:id', function(req, res) {
  prod.del(req.session.user, req.params.id, convert.resp(res));
});
module.exports = router;