var _msg = {
  'en-US': {
	verify_email_subject:'Verify email address',
	verify_email_text:'Hi ${name}\nPlease verify your email address so we know that it\'s really you:\nhttp://shapefly.com/user/verify/${verifyid}\n\nCheers\nThe Shapefly',
	verify_email_html:'Hi ${name}<br>Please verify your email address so we know that it\'s really you:<br><a href="http://shapefly.com/user/verify/${verifyid}">http://shapefly.com/user/verify/${verifyid}</a><br><br>Cheers<br>The Shapefly',
	changemail_email_subject:'Verify new email address',
	changemail_email_text:'Hi ${name}\nPlease verify your new email address so we know that it\'s really you:\nhttp://shapefly.com/user/verifyemailchanged/${verifyid}\n\nCheers\nThe Shapefly',
	changemail_email_html:'Hi ${name}<br>Please verify your new email address so we know that it\'s really you:<br><a href="http://shapefly.com/user/verifyemailchanged/${verifyid}">http://shapefly.com/user/verifyemailchanged/${verifyid}</a><br><br>Cheers<br>The Shapefly',
	forgot_email_subject:'Reset password',
	forgot_email_text:'Hi ${name}\nPlease reset your password:\nhttp://shapefly.com/user/reset/${verifyid}\n\nCheers\nThe Shapefly',
	forgot_email_html:'Hi ${name}<br>Please reset your password:<br>\n<a href="http://shapefly.com/user/reset/${verifyid}">http://shapefly.com/user/reset/${verifyid}</a><br><br>Cheers<br>The Shapefly',
  },
  'zh-CN': {
	verify_email_subject:'邮件地址确认'	  
  }
};

module.exports = {
  get: function(k, lang) {
	var  msg = _msg[lang||'en-US']||_msg['en-US'];
	return msg[k]||msg['en-US'][k];
  }  
};