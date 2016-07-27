var routerApi = require('./api');
var rp = require('../model/views/response');

module.exports = function(router){
	routerApi(router);

	//首页路由
	router.all('/index', function(req, res){
		res.json(rp.getRes(500, false));
	});

	//根目录路由
	router.all('/', function(req, res){
		res.json(rp.getRes(500, false));
	});

	//错误页
	router.all('/error', function (req, res) {
		res.status(403).json((rp.getRes(1)));
	});

	//其他的页面
	router.all('*', function(req, res){
		res.json(rp.getRes(500, false));
	});
};

