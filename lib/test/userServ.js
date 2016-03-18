var userServ = require("../serv/userServ");
//var mysqlClient = require('../dao/sqlclient').init();
userServ.signup({name:'administrator', password:'hao1234', email:'imailer@sina.com', ip:'192.168.1.1'}, function(c){
  console.log('signup:'+c);
});
userServ.signin('administrator', 'hao1234', '192.168.1.1', function(c){
  console.log('signin:'+c);
  /*
  if(c===code.success) {
	userServ.resendVerify(user, function(c) {
		console.log('resendVerify:'+c);
	});
	userServ.changePass(user, 'test1111', 'test1111', function(c) {
		console.log('changePass:'+c);
	});
	userServ.changeEmail(user, 'test@atasdf', function(c) {
		console.log('changeEmail:'+c);
	});
  }
  */
});
/*
userServ.forgot('est@test1', function(c){
  console.log('forgot:'+c);
});
userServ.resetPass('cbecd914-cdd3-4a49-a8b4-eac662101d59', 'test111', function(c){
  console.log('resetPass:'+c);
});
userServ.verify('cbecd914-cdd3-4a49-a8b4-eac662101d59', function(c){
  console.log('verify:'+c);
});
userServ.verifyEmailChanged('cbecd914-cdd3-4a49-a8b4-eac662101d59', function(c){
  console.log('verifyEmailChanged:'+c);
});
*/