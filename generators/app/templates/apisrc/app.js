var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var compression = require('compression')
var utool = require('./lib/utool');

var projectId = '<%= pname %>';
var app = express();

//----start-配置express参数和中间件------
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
//-----end--配置express参数和中间件------

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

//----start-设置路由------
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

module.exports = app;