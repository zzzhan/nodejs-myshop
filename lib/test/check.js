var check = require("../util/check");
console.log(check.isNumber('100,000'));
console.log(check.isNumber('551'));
console.log(check.isNumber('555.1'));
console.log(check.isNumber('555.14'));
console.log(check.isNumber('555.143'));