var r = require('rethinkdb');

var fs = require('fs');  
fs.readFile('./cacert', function(err, caCert) {  
  r.connect({
    host: 'aws-us-east-1-portal.5.dblayer.com',
    port:24068,
    authKey: '21536e12747fad0cd8c9f844577ee9db',
    ssl: {
      ca: caCert
    }
  }, function(error, conn) {
    r.dbList().run(conn, function(err, results) {
      console.log(results);
    })
  })
});