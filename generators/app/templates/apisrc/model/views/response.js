var ec = require('./errorCode');

var response = {
    code: 500,
    msg: ''
}

exports.getRes = function (code, status, result) {
    var r = response;
    r.code = 500;
    if(status){
        r.status = status;
    }else{
        r.status = false;
    }
    if(result){
        r.result = result;
    }else{
        r.result = "";
    }
    r.code = code;
    r.msg = ec.code[code];
    return r;
}

exports.getResCall = function(callback, code, status){
    var r = this.getErrorResponse(code, status);
    return callback + '(' + JSON.stringify(r) + ')';
}
