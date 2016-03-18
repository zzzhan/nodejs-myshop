var express = require('express');
var router = express.Router();
var convert= require("../util/convert");
var userServ= require("../serv/user");

router.post('/changepass', function(req, res) {
	var newpass = req.body.newpass;
	var oldpass = req.body.oldpass;
	userServ.changePass(req.session.user, oldpass, newpass, function(c){
      res.send(convert.json(c));
	});
});
router.post('/changemail', function(req, res) {
	var email = req.body.email;
	userServ.changeEmail(req.session.user, email, function(c){
      res.send(convert.json(c));
	});
});
module.exports = router;
