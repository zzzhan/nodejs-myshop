var prod = require("../dao/prod"),
	code = require("../conf/code"),
	checker = require("../util/check");
module.exports = {
  units: function(cb) {
	 prod.units(cb);
  },
  list: function(cb, q) {
	 prod.list(cb, q);	  
  },
  add: function(user, data, cb) {
	if(!(data.name&&data.price&&data.unit_name)) {
	  cb(code.param_notnull);
	} else if(!(checker.isNumber(data.price)&&
	  checker.isNumber(data.def_quantity))) {
	  cb(code.invalid_number);
	} else {
      prod.add(user, data, cb);
	}	 
  },
  upd: function(user, id, data, cb) {
	if(!(data.name&&data.price)) {
	  cb(code.param_notnull);
	} else if(!checker.isNumber(data.price)) {
	  cb(code.invalid_number);
	} else {
      prod.upd(user, id, data, cb);
	}
  },
  del: function(user, id, cb) {
    prod.del(id, cb);
  }
};