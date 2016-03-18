var txn = require("../dao/txn");
var code = require("../conf/code");
var check = require('../util/check');
module.exports = {
  addTxn: function(user, data, cb) {
	if(!(data.txn_details&&data.sum_amt)) {
	  cb(code.param_notnull);
	} else if(!check.isNumber(data.sum_amt)) {
	  cb(code.invalid_number);
	} else {
      txn.add(user, data, cb);
	}	 
  },
  list: function(user, data, cb) {
	if(!!data.start&&!check.isDate(data.start)) {
	  cb(code.invalid_date);
	} else if(!!data.end&&!check.isDate(data.end)) {
	  cb(code.invalid_date);
	} else {
	  txn.list(data, cb);
	}
  }
};