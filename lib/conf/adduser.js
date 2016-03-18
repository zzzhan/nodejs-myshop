var env = process.env.NODE_ENV || 'development',  
  mysqlConfig = require('../conf/mysql.json'),
  cfg = mysqlConfig[env]||mysqlConfig,
  user = require("../serv/user");
  require('mysql-queries').init(cfg);
require('dns').lookup(require('os').hostname(), function (err, addr) {
  var offset=2;
  if(process.argv.length<5) {
	throw 'Usage:node myuser username password email';
  } else {
    user.signup({name:process.argv[offset++], password:process.argv[offset++], 
      email:process.argv[offset++], ip:addr}, function(c, user){
      console.log('user created:'+c);
      console.log(user);
    });
  }
});