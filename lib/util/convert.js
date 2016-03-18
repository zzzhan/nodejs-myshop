var crypto = require("crypto"),
	jsonResp = function(c, data) {
	  return {"code":c, "data":data};
	};
module.exports = {
	dot2num: function(dot) {
	  var d = dot.split('.');
      return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
	},
	num2dot: function(num) {
      var part1 = num & 255;
      var part2 = ((num >> 8) & 255);
      var part3 = ((num >> 16) & 255);
      var part4 = ((num >> 24) & 255);

      return part4 + "." + part3 + "." + part2 + "." + part1;
	},
	hash: function(data) {		
	  var hash = crypto.createHash('sha1');
	  return hash.update(data).digest("hex");
	},
	json: jsonResp,
	resp: function(resp) {
	  return (function(res) {
		return function(c, rows) {
		 res.send(jsonResp(c, rows)); 
		};
	  })(resp);
	}
};