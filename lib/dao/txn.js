var sqlclient = require('mysql-queries'),
  callback = require('../util/callback');
module.exports = {
  add: function(user, txn, cb) {
	var jarr = JSON.parse(txn.txn_details),arr=[],
	  txnDate = new Date();
	for(var i=0;i<jarr.length;i++) {
	  var item = jarr[i];
	  arr[arr.length] = [item.quantity,item.id,item.price];
	}
	if(!txn.cust_id) {
	  delete txn.cust_id;
	}
	if(!!txn.txn_date) {
	  txnDate = new Date(txn.txn_date);
	}
	sqlclient.queries([
	  //'SELECT * FROM customer WHERE id=? AND name=? limit 1',
	  'UPDATE customer set txn_count=txn_count+1,addr=? WHERE id=? AND name=?',
	  'INSERT INTO customer(name,user_id,addr,txn_count,created,modified) VALUES(?,?,?,1,now(),now())',
	  'INSERT INTO txn_journal(sum_amt,cust_id,remark,user_id,txn_detail,txn_date,created) VALUES(?,?,?,?,?,?,now())',
	  'INSERT INTO txn_detail(quantity,prod_id,price,txn_id) VALUES ?',
	  'UPDATE product prod,txn_detail detail set prod.txn_quantity=prod.txn_quantity+detail.quantity'+
	  ' WHERE prod.id=detail.prod_id and detail.txn_id=?'
	], [[txn.cust_addr,txn.cust_id,txn.cust_name],[txn.cust_name,user.id,txn.cust_addr],
	  [txn.sum_amt,txn.cust_id,txn.remark,user.id,txn.txn_details,txnDate],[arr],[]], 
	  {beforeQuery:function(i, arg, results){
		switch(i) {
		  case 1:
		    //handle second sql
			//if customer exist or name not found,skip to create
		    if(results[0].affectedRows>0||!txn.cust_name) {
			  return true;
			}
			break;
		  case 2:
		    //handle third sql
			//new customer created
		    if(!!results[1]) {				
			  arg[1]=results[1].insertId;
			}
			break;
		  case 3:
		    //handle fouth sql
		    //set the txn_id for txn_detail table
		    for(var j=0;j<arg[0].length;j++) {
			  var row = arg[0][j];
			  row[row.length] = results[2].insertId;
		    }
		    break;
		  case 4:
			arg[0]=results[2].insertId;
		    break;
		}
	}}, callback.handle(cb));
  },
  list: function(data, cb) {
	var start = new Date(),
	  end=new Date(),
	  q=data.q;
	if(!!data.start) {start=new Date(data.start);}
	if(!!data.end) {end=new Date(data.end);}
	start.setHours(0,0,0,0);
	end.setHours(24,0,0,0);
	var query = 'SELECT txn.id,sum_amt txn_amt,cust_id,cust.name cust_name,remark,'+
	    ' cust.addr cust_addr,txn.user_id,'+
		' DATE_FORMAT(txn.txn_date,\'%Y-%m-%d\') txn_date,txn_detail'+
		' FROM txn_journal txn left join customer cust on txn.cust_id=cust.id'+
		' where 1=1';
	if(!data.start&&!data.end&&!!q) {	  
	  query+=' and cust.name like ?';
	  sqlclient.query(query,['%'+q+'%'], callback.handle(cb));
	} else {
	  query+=' and txn.txn_date between ? and ?'+(!!q?' and cust.name like ?':'');
	  sqlclient.query(query,[start, end, '%'+q+'%'], callback.handle(cb));
	}
  },
  del:function(id, cb) {
	sqlclient.queries(['DELETE FROM txn_detail WHERE txn_id=?',
	  'DELETE FROM txn_journal WHERE id=?'], [[id],[id]], callback.handle(cb));
  }
};