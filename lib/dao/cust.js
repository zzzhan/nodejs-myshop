var sqlclient = require('mysql-queries'),
  callback = require('../util/callback');
module.exports = {
  list: function(data, cb) {
	var q=data.q;
	sqlclient.query('SELECT id,name,mobile,email,id_num,addr,user_id,'+
		' DATE_FORMAT(created,\'%Y-%m-%d\') created'+
		' FROM customer'+
		' WHERE 1=1 '+(!!q?' and name=?':'')+
		' ORDER BY txn_count DESC',[data.q], 
	  callback.handle(cb));
  }
};