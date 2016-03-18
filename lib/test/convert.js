var convert = require("../util/convert");
var code= require("../conf/code");
console.log(convert.num2dot(convert.dot2num('255.255.255.255')));
console.log(convert.num2dot(convert.dot2num('192.168.1.107')));
console.log(convert.dot2num('255.255.255.255'));
console.log(convert.dot2num('192.168.1.107'));
console.log(convert.json(code.success));