var ctrlApi = require('../core/controller/api');
var rp = require('../model/views/response');

module.exports = function(router){

  //获取api内容
  router.get('/getApi', function(req, res) {
    res.json(rp.getRes(0, true, ctrlApi.getApi()));
  });
};