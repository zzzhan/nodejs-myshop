var sqlclient = require('mysql-queries'),
  callback = require('../util/callback');
module.exports = {
  units: function(cb) {
	sqlclient.query(
        'SELECT * FROM prod_unit', callback.handle(cb));
  },
  types: function(cb) {
	sqlclient.query(
        'SELECT * FROM prod_type', callback.handle(cb));
  },
  list:function(cb, q) {
    sqlclient.query(
	  'SELECT id, name, type_id, unit_id, price, def_quantity, user_id, DATE_FORMAT(created,\'%Y-%m-%d\') created, DATE_FORMAT(modified,\'%Y-%m-%d\') modified FROM product where status=0'+
	  (!!q?' AND name LIKE ? OR sname LIKE ? OR type_id = ?':'')+
	  ' ORDER BY txn_quantity DESC', [q+'%', q+'%', q], callback.handle(cb));
  },
  add:function(user, data, cb) {
	sqlclient.queries(['SELECT * FROM prod_unit WHERE NAME=? limit 1',
	'INSERT INTO prod_unit(name,user_id,created,modified) values(?,?,now(),now())',
	'SELECT * FROM prod_type WHERE NAME=? limit 1',
	'INSERT INTO prod_type(name,user_id,created,modified) values(?,?,now(),now())',
	'INSERT INTO product(name, type_id, unit_id, price, def_quantity, user_id, created, modified) VALUES(?, ?, ?, ?, ?, ?, now(), now())',
	'UPDATE product SET name=?,type_id=?,unit_id=?,price=?,def_quantity=?,user_id=?,modified=now() WHERE id=?'],
	[[data.unit_name,user.id],[data.unit_name,user.id],
	  [data.type_name,user.id],[data.type_name,user.id],
	  [data.name,data.type_id,data.unit_id,data.price,
       data.def_quantity,user.id],
	  [data.name,data.type_id,data.unit_id,data.price,
       data.def_quantity,user.id,data.id]], {
		  beforeQuery:function(i, arg, results) {
			var skip = false;
			switch(i) {
			  case 1:		
				//if unfound unit,create new one
			    skip = results[0].length!==0;
				break;
			  case 3:	
				//if unfound type,create new one
			    skip = results[2].length!==0;
				break;
			  case 4:
			    skip = !!data.id;
			    //type inserted
			    if(results[2].length===0) {
				  arg[1]=results[3].insertId;
				}
			    //unit inserted
			    if(results[0].length===0) {
				  arg[2]=results[1].insertId;
				}
			    break;
			  case 5:
			    skip = !data.id;
			    //type inserted
			    if(results[2].length===0) {
				  arg[1]=results[3].insertId;
				}
			    //unit inserted
			    if(results[0].length===0) {
				  arg[2]=results[1].insertId;
				}
			    break;
			}
			return skip;
		  }
	  }, callback.handle(cb));
  },
  upd:function(user, id, data, cb) {
	sqlclient.query(
	  'UPDATE product SET name=?, price=?, def_quantity=?, user_id=?, modified=now()'+
	  ' WHERE id=?',
	  [data.name,data.price,data.def_quantity||1,user.id,id],
	  callback.handle(cb));
  },
  del:function(id, cb) {
	sqlclient.queries(['SELECT * FROM txn_detail WHERE prod_id=? limit 1',
	  'UPDATE product SET STATUS=STATUS|1 WHERE id=?',
	  'DELETE FROM product WHERE id=?'], [[id],[id],[id]], {
		  beforeQuery:function(i, arg, results) {
			var skip = false;
			switch(i) {
			  case 1:		
				//skip update if txn_detail exists
			    skip = results[0].length===0;
				break;
			  case 2:
				//skip delete if txn_detail not exists
			    skip = results[0].length!==0;
			    break;
			}
			return skip;
		  }
	  }, callback.handle(cb));
  }
};