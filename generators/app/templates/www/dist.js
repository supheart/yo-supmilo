var app = require('../dist/app');
var utool = require('../dist/lib/utool');

//----start-启动服务器------
var port = utool.conf('host.port') || '443';
var isHttps = utool.conf('host.isHttps');
if(isHttps){
  var https = require('https');
  const credentials = {
    key: fs.readFileSync(__dirname + '/../oauth/encrypted.key'),
    cert: fs.readFileSync(__dirname + '/../oauth/sign.crt'),
    passphrase: '123456'
  };

  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, function(){
    logger.info('start https server, listen port ' + port);
  });
}else{
  app.listen(port, function(){
    logger.info('start http server, listen port ' + port);
  });
}
//-----end--启动服务器------