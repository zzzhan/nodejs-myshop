var code = require('../conf/code'),
	log4js = require('log4js'),
	logger = log4js.getLogger('logInfo');  
var callback = function(err, rs, cb) {
	if(typeof cb === 'function') {
	  if(!!err) {
		logger.error(err);
		cb(code.sys_err);
	  } else {
		cb(code.success, rs);
	  }
	} else {
	  throw 'Unfound callback function';
	}
};
module.exports = {
  handle:function(cb) {
    return function(e, rs) {
	  callback(e, rs, cb);
    };
  }
};