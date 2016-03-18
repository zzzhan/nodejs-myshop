var conf= require("../conf/email.json");
var message= require("../conf/message");
var dotpl= require("dotpl");
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: conf.service,
    auth: {
        user: conf.user,
        pass: conf.pass
    }
});
var email = module.exports;
var send = function(mailoptions) {	
	// send mail with defined transport object
	transporter.sendMail(mailoptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);

	});
};
email.send = send;
email.sendVerify = function(user, verifyid) {
	var text = dotpl.applyTpl(message.get('verify_email_text'), {name:user.nickname||user.name, verifyid:verifyid});
	var html = dotpl.applyTpl(message.get('verify_email_html'), {name:user.nickname||user.name, verifyid:verifyid});
	send({from: 'Shapefly <noreply@shapefly.com>',
		to: user.email,
		subject: message.get('verify_email_subject'),
		text: text,
		html: html
	});
};
email.sendEmailChange = function(user, verifyid) {
	var text = dotpl.applyTpl(message.get('changemail_email_text'), {name:user.nickname||user.name, verifyid:verifyid});
	var html = dotpl.applyTpl(message.get('changemail_email_html'), {name:user.nickname||user.name, verifyid:verifyid});
	send({from: 'Shapefly <noreply@shapefly.com>',
		to: user.premail,
		subject: message.get('changemail_email_subject'),
		text: text,
		html: html
	});
};
email.sendPassForgot = function(user, verifyid) {
	var text = dotpl.applyTpl(message.get('forgot_email_text'), {name:user.nickname||user.name, verifyid:verifyid});
	var html = dotpl.applyTpl(message.get('forgot_email_html'), {name:user.nickname||user.name, verifyid:verifyid});
	send({from: 'Shapefly <noreply@shapefly.com>',
		to: user.email,
		subject: message.get('forgot_email_subject'),
		text: text,
		html: html
	});
};