var ctrlIndex = require('../core/controller/index');
var routerTest = require('./test');
var rp = require('../model/views/response');

module.exports = function(router){
	routerTest(router);
	
  var data = ctrlIndex.getIndex();

	//首页路由
	router.all('/index', function(req, res){
		res.render('index', data);
	});

	//根目录路由
	router.all('/', function(req, res){
		res.render('index', data);
	});

	//错误页
	router.all('/error', function (req, res) {
		res.status(403).json((rp.getRes(1)));
	});

	//其他的页面
	router.all('*', function(req, res){
		res.render('index', data);
	});
};