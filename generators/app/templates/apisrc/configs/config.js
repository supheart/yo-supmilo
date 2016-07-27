module.exports = {
	host: {
		//设置是否启动https的服务，注意修改对应的端口号，这里端口号不会自动改为对应的默认ip
		isHttps: false,
		homePage: '/',
		port: 8013
	},
  <% if(ismysql) { -%>
	db: {
		client: 'mysql',
		connection: {
			host     : '127.0.0.1',
			user     : 'root',
			password : 'root',
			database : 'test'
		}
	},
  <% } -%>
	log: {
		appenders: [
			{type: 'console'},
			{
				type: 'dateFile',
				filename: __dirname + '/../../logs/',
				alwaysIncludePattern: true,
				pattern: 'yyyy-MM-dd.log',
				category: 'normal'
			}
		],
		replaceConsole: true,
		dirname: __dirname + '/../../logs',
		logformat: 'remote-addr(:remote-addr),method(:method),url(:url),http(HTTP/:http-version),state(:status),contentLength(:res[Content-Length]),responseTime(:response-time),referer(:referrer)'
	}
};