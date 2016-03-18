module.exports = {
  pass: function(pass) {
    return /(?=.*\d)(?=.*[a-zA-Z])\w{7,}/.test(pass);
  },
  email: function(email) {
    return /^[^@]+@[^@]+$/.test(email);
  },
  usernameInvalid: function(name) {
	return name.length<4||/^(\w)\1+$/.test(name);
  },
  usernamePattern: function(name) {
	return /^[0-9a-zA-Z]+\-?[0-9a-zA-Z]+$/.test(name);
  },
  isNumber: function(name) {
	return /^(([1-9](\d*|\d{0,2}(,\d{3})*))|0)(\.\d{1,2})?$/.test(name);
  },
  isDate: function(name) {
	return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(name);
  }
};