module.exports = function(router){

  //获取api内容
  router.get('/test', function(req, res) {
    res.render('test');
  });
};