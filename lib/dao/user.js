var mysqlClient = require('mysql-queries'),
  code = require("../conf/code"),  
  convert = require('../util/convert'),
  conf = require("../conf/conf.json"), 
  uuid = require('node-uuid'),
  callback = require('../util/callback'),
  user = module.exports,
  _USER_FIELDS = "id, name, email, premail, ifnull(nickname, name) nickname, company, verified, privilege, level, verify_expire";
user.queryByEmail = function(email, cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' FROM user WHERE email=?',
        [email], callback.handle(cb));
};
user.queryByName = function(name, cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' FROM user WHERE name=?',
        [name], callback.handle(cb));
};
user.queryById = function(id, cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' FROM user WHERE id=?',
        [id], callback.handle(cb));
};
user.queryByVerifyId = function(id, cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' FROM user WHERE verify_uuid=?',
        [id], callback.handle(cb));
};
user.updatePass = function(id, pass, cb) {		
	mysqlClient.query('UPDATE user set password=? where id=?', [pass, id], callback.handle(cb));
};
user.updateVerified = function(id, verified, cb) {		
	mysqlClient.query('UPDATE user set verified=?, verify_expire=? where id=?', [verified, new Date(), id], callback.handle(cb));
};
user.auth = function(loginid, pass, cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' FROM user WHERE (email=? or name=?) and password=?',
        [loginid, loginid, pass], callback.handle(cb));
	
};
user.signinUpdate = function(id, ip, cb) {
	mysqlClient.query('UPDATE user set last_signin=signin, last_ipaddr=ipaddr,' + ' ipaddr=?, signin=? where id=?', 
	  [ip, new Date(), id], callback.handle(cb));
};
user.add = function(args, cb) {	
  mysqlClient.query(
        "INSERT INTO user(name, email, password, signup, signin, ipaddr, lang, verify_uuid, verify_expire, recommander)" +
				  "VALUES(?, ?, ?, current_timestamp(2), current_timestamp(2), ?, ?, ?, ?, ?)",
        args, callback.handle(cb));
};
user.addUser = function(user, cb) {
  mysqlClient.queries(['select * from user where name=?',
    'select * from user where email=?',
	'INSERT INTO user(name, email, password, signup, signin, ipaddr, lang, verify_uuid, verify_expire, recommander)'+' VALUES(?, ?, ?, now(), now(), ?, ?, ?, ?, ?)'],
	[[user.name],[user.email],[user.name, user.email, user.password, '', '', '', '', user.recommander]], {
		beforeQuery:function(i, arg, results) {
		  var rs = null;
		  switch(i) {
			case 1:
			  rs = results[i-1];
			  if(rs.length>0) {
				throw code.username_inused;
			  }
			break;
			case 2:
			  rs = results[i-1];
			  if(rs.length>0) {
				throw code.email_inused;
			  }
			  var offset = 2;
			  arg[offset++] =  convert.hash(arg[2]);
			  arg[offset++] = convert.dot2num(user.ipaddr||'127.0.0.1');
			  arg[offset++] = user.lang||'en-us';
			  arg[offset++] = (user.verify_uuid=uuid.v4());
			  var now = new Date();
			  now.setTime(now.getTime()+conf.user_verify_expired);
			  arg[offset++] = now;
			break;
		  }
		}
	}, cb);
};
user.list = function(cb) {	
	mysqlClient.query(
        'SELECT '+_USER_FIELDS+' from file where user_id=? order by updated desc',
        null, callback.handle(cb));
};
user.updateVerifyUuid = function(id, uuid, expire, cb) {	
  mysqlClient.query('UPDATE user set verify_uuid=?, verify_expire=? where id=?', [uuid, expire, id], callback.handle(cb));
};
user.updatePremail = function(id, email, uuid, expire, cb) {	
  mysqlClient.query('UPDATE user set premail=?, verify_uuid=?, verify_expire=? where id=?', [email, uuid, expire, id], callback.handle(cb));
};
user.verfifyEmailChanged = function(id, email, cb) {	
  mysqlClient.query('UPDATE user set email=?,verified=1, verify_expire=? where id=?', [email, new Date(), id], callback.handle(cb));
};
user.update = function(user, cb) {
  mysqlClient.query('UPDATE user set nickname=?, company=? where id=?', [user.nickname, user.company, user.id], callback.handle(cb));
};