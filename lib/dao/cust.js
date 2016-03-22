var sqlclient = require('mysql-queries'),
  callback = require('../util/callback');
module.exports = {
  types: function(cb) {
	sqlclient.query(
        'SELECT * FROM cust_type', callback.handle(cb));
  },
  list: function(data, cb) {
	var q=data.q;
	sqlclient.query('SELECT id,type_id,name,mobile,email,id_num,addr,user_id,'+
		' DATE_FORMAT(created,\'%Y-%m-%d\') created'+
		' FROM customer'+
		' WHERE 1=1 '+(!!q?' and (name like ? or mobile like ? or email like ? or type_id=?)':'')+
		' ORDER BY txn_count DESC',['%'+q+'%',q+'%',q+'%',q], 
	  callback.handle(cb));
  },
  addNUpdate:function(user, data, cb) {
	sqlclient.queries([
	'SELECT * FROM cust_type WHERE NAME=? limit 1',
	'INSERT INTO cust_type(name,user_id,created,modified) values(?,?,now(),now())',
	'INSERT INTO customer(name, type_id, mobile, addr, email, user_id, created, modified) VALUES(?, ?, ?, ?, ?, ?, now(), now())',
	'UPDATE customer SET name=?,type_id=?,mobile=?,addr=?,email=?,user_id=?,modified=now() WHERE id=?'],
	[[data.type_name,user.id],[data.type_name,user.id],
	  [data.name,data.type_id,data.mobile,data.addr,data.email,user.id],	  
	  [data.name,data.type_id,data.mobile,data.addr,data.email,user.id,data.id]], {
		  beforeQuery:function(i, arg, results) {
			var skip = false;
			switch(i) {	  
			  case 1:		
			    skip = results[0].length!==0;
				break;
			  case 2:
			    skip = !!data.id;
			    //type inserted
			    if(results[0].length===0) {
				  arg[1]=results[1].insertId;
				}
			    break;
			  case 3:
			    skip = !data.id;
			    break;
			}
			return skip;
		  }
	  }, callback.handle(cb));
  },
  del:function(id, cb) {
	sqlclient.queries(['SELECT * FROM txn_journal WHERE cust_id=? limit 1',
	  'UPDATE customer SET STATUS=STATUS|1 WHERE id=?',
	  'DELETE FROM customer WHERE id=?'], [[id],[id],[id]], {
		  beforeQuery:function(i, arg, results) {
			var skip = false;
			switch(i) {
			  case 1:		
				//skip update if txn_journal exists
			    skip = results[0].length===0;
				break;
			  case 2:
				//skip delete if txn_journal not exists
			    skip = results[0].length!==0;
			    break;
			}
			return skip;
		  }
	  }, callback.handle(cb));
  }
};