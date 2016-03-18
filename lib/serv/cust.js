var cust = require("../dao/cust");
module.exports = {
  list: function(user, data, cb) {
	cust.list(data, cb);
  }
};