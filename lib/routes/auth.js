var express = require('express');
var router = express.Router();
var userServ= require("../serv/user");
var code= require("../conf/code");
var convert= require("../util/convert");

router.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email.toLowerCase();	
	var password = req.body.password;
	var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
	var lang = req.headers["accept-language"];
	if(lang!=null) {
	  lang = lang.substring(0,2);
	}
	var recommander = req.cookies.recommander;
	userServ.signup({name:name,email:email,password:password,
	  ipaddr:ip,lang:lang,recommander:recommander}, function(c, user){
		req.session.user = user;
		res.send(convert.json(c, user));
	});
});
router.post('/signin', function(req, res) {
	var login = req.body.login;		
	var password = req.body.password;
	var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
	userServ.signin(login, password, ip, function(c, user){
		if(c===code.success) {
		  req.session.user = user;		  
		}	
		res.send(convert.json(c, user));
	});
});
router.post('/forgot', function(req, res) {
	var email = req.body.email;
	userServ.forgot(email, function(c){
		res.send(convert.json(c));
	});
});
router.put('/forgot', function(req, res) {
	var password = req.body.newpass;
	var verifyid = req.cookies.verifyid;
	userServ.resetPass(verifyid, password, function(c){
      res.send(convert.json(c));
	});
});
router.put('/verify', function(req, res) {
	var verifyid = req.cookies.verifyid;
	console.log(verifyid);
	userServ.verify(verifyid, function(c){
	  if(c===code.success) {
		  if(req.session.user!=null) {
		    req.session.user.verified = 1;
		  }
	  }
      res.send(convert.json(c));
	});	
});
router.post('/verify', function(req, res) {
	userServ.resendVerify(req.session.user, function(c){
      res.send(convert.json(c));
	});
});
router.get('/signout', function(req, res) {
	delete req.session.user;
	res.send(convert.json(code.success));
});
router.get('/', function(req, res) {
	if(!!req.session.user) {
		res.send(convert.json(code.success, req.session.user));		
	} else {
		res.send(convert.json(code.failure));		
	}
});
router.post('/changemail', function(req, res) {
	var email = req.body.email;
	userServ.changemail(req.session.user, email, function(c){
      res.send(convert.json(c));
	});
});
router.post('/changepass', function(req, res) {
	var oldpass = req.body.oldpass;
	var newpass = req.body.newpass;
	userServ.changePass(req.session.user, oldpass, newpass, function(c){
      res.send(convert.json(c));
	});
});
router.put('/changemail', function(req, res) {
	var verifyid = req.cookies.verifyid;
	userServ.verifyEmailChanged(verifyid, function(c){
      res.send(convert.json(c));
	});
});
router.put('/profile', function(req, res) {
	var nickname = req.body.nickname;
	var company = req.body.company;
	userServ.updateProfile(req.session.user, {nickname:nickname,company:company}, function(c){
	  if(c===code.success) {
		req.session.user.nickname = nickname;
		req.session.user.company = company;
	  }
      res.send(convert.json(c));		
	});
});

module.exports = router;
