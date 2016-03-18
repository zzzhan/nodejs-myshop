var user= require("../dao/user");
//var code= require("../conf/code");
var resutil = require('../util/response');

user.queryByEmail('imailer@sina.com', function(err, rs) {
		var ret = resutil.convertJSON(err, rs);
		console.log(ret);
	
});
user.queryById(1000, function(err, rs) {
		var ret = resutil.convertJSON(err, rs);
		console.log(ret);
});