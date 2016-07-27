var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
<% if(isrsess){ -%>
var Redis = require('ioredis');
var redisStore = require('connect-redis')(session);
<% } -%>
var log4js = require('log4js');
var compression = require('compression')
var utool = require('./lib/utool');

var projectId = '<%= pname %>';
var app = express();

//----start-配置express参数和中间件------
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit: '16mb', extended: true }));
app.use(cookieParser());
<% if(!isrsess){ -%>
var sessionConf = utool.conf('session');
app.use(session(sessionConf));
<% } -%>
//-----end--配置express参数和中间件------

<% if(isrsess){ -%>
//----start-设置redis连接------
var redisConf = utool.conf('redis');
global.ioRedis = new Redis(redisConf);
var sessionConf = utool.conf('session');
sessionConf.store = new redisStore({client: global.ioRedis});
app.use(session(sessionConf));
//-----end--设置redis连接------
<% } -%>

//----start-设置日志处理------
var logConf = utool.conf('log');
if (!fs.existsSync(logConf.dirname)) {
	fs.mkdirSync(logConf.dirname);
}
log4js.configure(logConf);
logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level: log4js.levels.INFO, format: logConf.logformat}));
logger.info('start log..');
//-----end--设置日志处理------

//----start-设置路由和过滤器------
var indexFilter = require('./core/filter/index');
app.use(indexFilter.index);
var indexRoute = require('./router/index');
indexRoute(app);
//-----end--设置路由------

<% if(ismysql){ %>
//----start--设置数据库------
global.knex = require('knex')(utool.conf('db'));
global.knex.raw('set names utf8mb4').asCallback(function (err, data) {
	global.knex.raw("show variables like 'character_set_%'").asCallback(function (err, data) {
		logger.info(JSON.stringify(data));
	});
});
//-----end---设置数据库------
<% } %>

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