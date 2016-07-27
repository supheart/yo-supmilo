exports.index = function(req, res, next) {
    next();
}

exports.login = function(req, res, next) {
    if(!req.session.userInfo){
      res.redirect('/login');
    }
    next();
}