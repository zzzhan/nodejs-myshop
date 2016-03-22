var express = require('express'),
	router = express.Router(),
	sqlclient = require('mysql-queries'),
    callback = require('../util/callback'),
	convert= require('../util/convert');
router.get('/', function(req, res) {
  sqlclient.queries(['select * from prod_unit',
    'select * from prod_type',
    'select * from cust_type'],[],
	callback.handle(convert.resp(res)));
});
module.exports = router;