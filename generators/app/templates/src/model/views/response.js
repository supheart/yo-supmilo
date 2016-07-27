var ec = require('./errorCode');

var response = {
    code: 1,
    msg: ''
}

exports.getRes = function (code, data) {
    var r = response;
    r.code = 1;
    if(data){
        r.data = data;
    }else{
        r.data = "";
    }
    r.code = code;
    r.msg = ec.code[code];
    return r;
}

exports.getResCall = function(callback, code, data){
    var r = this.getErrorResponse(code, data);
    return callback + '(' + JSON.stringify(r) + ')';
}
