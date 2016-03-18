var userDao = require("../dao/user"),
  code = require("../conf/code"),  
  conf = require("../conf/conf.json"),  
  nodemail = require("../util/email"),
  convert = require('../util/convert'),
  check = require('../util/check'),
  uuid = require('node-uuid'),
  VERIFY_EXPIRED = 1000*60*60*24,
  preSendEmail = function(email, cb) {
	if(check.email(email)) {
	  userDao.queryByEmail(email, function(c, rows) {
		  if(c===code.success) {
			  if(rows.length===0) {
				cb(code.email_unfound);
			  } else {
				var user = rows[0];
				var verifyid = uuid.v4();
				var expired = new Date().getTime()+VERIFY_EXPIRED;
				userDao.updateVerifyUuid(user.id, verifyid, new Date(expired), function(c) {
				  if(c===code.success) {
					cb(c, user, verifyid);
				  } else {					
				    cb(c);
				  }
				});		
			  }
		  } else {
			  cb(c);
		  }
	  });
	} else {
		cb(code.invalid_email);
	}
};
var userServ = {
	signup: function(user, cb) {
		var name = user.name;
		var email = user.email;
		var password = user.password;
		if(name==null||email==null||password==null) {
		  cb(code.param_notnull);
		} else if(!check.usernamePattern(name)) {
		  cb(code.username_invalid_pattern);
		} else if(check.usernameInvalid(name)) {
		  cb(code.username_inused);
		} else if(!check.email(email)) {
		  cb(code.invalid_email);
		} else if(!check.pass(password)) {
		  cb(code.invalid_password);
		} else {
		  userDao.addUser(user, function(err,results){
		    if(!!err) {					
			  cb(err);
		    } else {
			  delete user.password;
			  if(!!conf.send_email) {
			    nodemail.sendVerify(user, user.verify_uuid);
			    delete user.verify_uuid;
			    cb(c, user);
			  } else {
			    delete user.verify_uuid;
			    cb(code.success, user);
			  }
		    }
		  });
		}
	},
	signin: function(loginid, password, ip, cb) {
	  if(loginid==null||password==null) {
	    cb(code.param_notnull);
	  } else {
		  if(check.email(loginid)||check.usernamePattern(loginid)||check.pass(password)) {
	      password =  convert.hash(password);
		  userDao.auth(loginid, password, function(c, rows) {
		    if(c===code.success) {
			  if(rows.length===0) {
				cb(code.login_failure);
			  } else {
			    var user = rows[0];
				//console.log(ip);
				var iplong = convert.dot2num(ip||'127.0.0.1');
				userDao.signinUpdate(user.id, iplong, function(c){
			      cb(c, user);
				});
			  }
			} else {
			  cb(code.login_failure);
			}
		  });
		} else {
		  cb(code.login_failure);		
		}
	  }
	},
	changePass: function(user, oldpass, newpass, cb) {
	  if(oldpass!=null&&newpass!=null&&check.pass(oldpass)&&check.pass(newpass)&&user!=null) {
		if(oldpass===newpass) {
		  cb(code.old_new_pass_insame);	
		} else {
	      oldpass =  convert.hash(oldpass);
		  userDao.auth(user.name, oldpass, function(c, rows) {
		    if(c===code.success) {
			  if(rows.length===0) {
				cb(code.wrong_pass);
			  } else {
			    newpass =  convert.hash(newpass);
			    userDao.updatePass(user.id, newpass, cb);
			  }
			} else {
			  cb(c);
			}
		  });
        }		  
	  } else {
		if(newpass==null||oldpass==null) {
		  cb(code.param_notnull);
		} else if(user==null){
		  cb(code.auth_failure);
		} else {
		  cb(code.invalid_password);
		}
	  }
	},
	changemail: function(user, email, cb) {
	  if(email==null) {
		cb(code.param_notnull);
	  } else if(!check.email(email)) {
		cb(code.invalid_email);
	  } else if(user.email===email) {
		cb(code.old_new_email_insame);
	  } else if(user==null) {
		cb(code.auth_failure);
	  } else {
		userDao.queryByEmail(email, function(c, rows) {
			if(c!==code.success) {
				return cb(c);
			}
			if(rows.length!==0) {
				return cb(code.email_inused);
			} else {
			  var verifyid = uuid.v4();
			  var expired = new Date().getTime()+VERIFY_EXPIRED;
			  user.premail = email;
			  userDao.updatePremail(user.id, email, verifyid, new Date(expired), function(c) {
				  if(c===code.success) {
					 nodemail.sendEmailChange(user, verifyid);
				  }
				  cb(c);
			  });				
			}
		});
	  }
	},
	verifyEmailChanged: function(verifyid, cb) {
		userDao.queryByVerifyId(verifyid, function(c, rows){
		  if(c===code.success) {
			  if(rows.length===0) {
				cb(code.invalid_verify);
			  } else {
				var user = rows[0];
				if(user.verify_expire.getTime()<new Date().getTime()) {
				  cb(code.verify_expired);					
				} else {
				  userDao.verfifyEmailChanged(user.id, user.premail, cb);
				}
			  }
		  } else {
			cb(c);			  
		  }	
		});
	},
	verify: function(verifyid, cb) {
		userDao.queryByVerifyId(verifyid, function(c, rows){
		  if(c===code.success) {
			  if(rows.length===0) {
				cb(code.invalid_verify);
			  } else {
				var user = rows[0];
				if(user.verify_expire.getTime()<new Date().getTime()) {
				  cb(code.verify_expired);						
				} else {
				  userDao.updateVerified(user.id, 1, cb);
				}
			  }
		  } else {
			cb(c);			  
		  }
		});
	},
	resendVerify: function(user, cb) {
	  if(user!=null) {
		  var verifyid = uuid.v4();
		  var expired = new Date().getTime()+VERIFY_EXPIRED;
		  userDao.updateVerifyUuid(user.id, verifyid, new Date(expired), function(c) {
			  if(c===code.success) {
				 nodemail.sendVerify(user, verifyid);
			  }
			  cb(c);
		  });
      } else {
		cb(code.auth_failure);
	  }	  
	},
	forgot: function(email, cb) {
	  preSendEmail(email, function(c, user, verifyid){		
	    if(c===code.success) {
		  nodemail.sendPassForgot(user, verifyid);
		  cb(c, user);
	    } else {
		  cb(c);
	    }
	  });
	},
	resetPass: function(verifyid, password, cb) {
		if(password==null||verifyid==null) {
		  cb(code.param_notnull);
		} else if(check.pass(password)) {
			userDao.queryByVerifyId(verifyid, function(c, rows){
			  if(c===code.success) {
				  if(rows.length===0) {
					cb(code.invalid_verify);
				  } else {
					var user = rows[0];
					if(user.verify_expire.getTime()<new Date().getTime()) {
					  cb(code.verify_expired);						
					} else {
					  password =  convert.hash(password);
					  userDao.updateVerified(user.id, 1, function(){						  
					    userDao.updatePass(user.id, password, cb);
					  });
					}
				  }
			  } else {
				cb(c);			  
			  }	
			});
		} else {			
		  cb(code.invalid_password);
		}
	},
	updateProfile: function(user, profile, cb) {
	  if(user==null) {
		  cb(code.auth_failure);
	  } else {
		  var nick = profile.nickname;
		  var company = profile.company;
		  if((nick!=null&&nick.length>50)||(company!=null&&company.length>60)) {
			cb(code.param_invalid);
		  } else {
		    profile.id = user.id;
		    userDao.update(profile, cb);			  
		  }
	  }
	}
};
module.exports = userServ;
