var app = require('../src/app');
var utool = require('../src/lib/utool');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
global.cc = cluster;

if(cluster.isMaster){
  //遍历cpu的个数
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('listening',function(worker, address){
		logger.info('listen: '+i+', pid: '+ worker.process.pid);
	});
	cluster.on('exit', function(worker, code, signal) {
		logger.info('exit: '+i+', pid: '+ worker.process.pid+' restart');
		setTimeout(function() {cluster.fork();},2000);
	});
}else{
  process.on('message', function(msg) {
    logger.info('[worker] '+msg);
  });

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
}