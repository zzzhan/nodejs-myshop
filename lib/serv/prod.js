var prod = require("../dao/prod"),
	code = require("../conf/code"),
	checker = require("../util/check");
module.exports = {
  units: function(cb) {
	 prod.units(cb);
  },
  types: function(cb) {
	 prod.types(cb);
  },
  list: function(cb, q) {
	 prod.list(cb, q);	  
  },
  add: function(user, data, cb) {
	if(!(data.name&&data.price&&data.unit_name&&data.type_name)) {
	  cb(code.param_notnull);
	} else if(!(checker.isNumber(data.price)&&
	  checker.isNumber(data.def_quantity))) {
	  cb(code.invalid_number);
	} else {
      prod.add(user, data, function(c, rows){
		if(code.success===c) {
		  var row = rows[rows.length-2];
		  data.id = data.id||row.insertId;
		  if(typeof data.id==='string') {
			data.id=parseInt(data.id);
		  }
		  if(rows[0].length===0) {
			data.unit_id=rows[1].insertId;
		  }
		  if(rows[2].length===0) {
			data.type_id=rows[3].insertId;
		  }
		  cb(c, data);
		} else {
		  cb(c, rows);
		}  
	  });
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