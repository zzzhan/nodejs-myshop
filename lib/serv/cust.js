var cust = require("../dao/cust"),
	code = require("../conf/code");
module.exports = {
  types: function(cb) {
	 cust.types(cb);
  },
  list: function(user, data, cb) {
	cust.list(data, cb);
  },
  addNUpdate: function(user, data, cb) {
	if(!(data.name&&data.type_name)) {
	  cb(code.param_notnull);
	} else {
	  cust.addNUpdate(user, data, function(c, rows){
		if(code.success===c) {
		  var row = rows[rows.length-2];
		  data.id = data.id||row.insertId;
		  if(typeof data.id==='string') {
			data.id=parseInt(data.id);
		  }
		  if(rows[0].length===0) {
			data.type_id=rows[1].insertId;
		  }
		  cb(c, data);
		} else {
		  cb(c, rows);
		}  
	  });
	}
  },
  del: function(user, id, cb) {
    cust.del(id, cb);
  }
};