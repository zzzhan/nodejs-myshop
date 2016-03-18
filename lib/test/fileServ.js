var fileServ = require("../serv/fileServ");
//var mysqlClient = require('../dao/sqlclient').init();
//var code = require('../conf/code');

fileServ.queryById(0, function(c, data){
  console.log(c);
  console.log(data);
});
fileServ.rename('test', 0, function(c, data){
  console.log(c);
  console.log(data);
});
fileServ.list({id:10000}, null, function(c, data){
  console.log(c);
  console.log(data);	
});