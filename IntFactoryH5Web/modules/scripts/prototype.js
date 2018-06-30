//格式化日期
Date.prototype.toString = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//日期字符串转换日期格式
String.prototype.toDate = function (format) {
    var d = new Date();
    d.setTime(this.match(/\d+/)[0]);
    return (!!format) ? d.toString(format) : d;
}

//截取字符串
String.prototype.subString = function (len) {
    if (this.length > len) {
        return this.substr(0, len - 1) + "...";
    }
    return this;
}

//判断字符串是否整数
String.prototype.isInt = function () {
    return this.match(/^(0|([1-9]\d*))$/);
}

//判断字符串是否数字
String.prototype.isDouble = function () {
    return this.match(/^\d+(.\d+)?$/);
}

//数字转化为千位
Number.prototype.toMoney = function () {
    var _value, _arr, _int, _decimal, _re;
    _value = this.toString();
    _arr = _value.split(".");
    _int = _arr[0], _decimal = "00";
    if (_arr.length > 1) {
        _decimal = _arr[1];
    }
    _int = _int.replace(/^(-?\d*)$/, "$1,");

    _re = /(\d)(\d{3},)/;
    while (_re.test(_int)) {
        _int = _int.replace(_re, "$1,$2");
    }
    _value = _int + _decimal;
    _value = _value.replace(/,(\d*)$/, ".$1");
    return _value;
};

//字符格式数字转化为千位
String.prototype.toMoney = function () {
    var _value, _arr, _int, _decimal, _re;
    _value = this;
    _arr = _value.split(".");
    _int = _arr[0], _decimal = "00";
    if (_arr.length > 1) {
        _decimal = _arr[1];
    }
    _int = _int.replace(/^(-?\d*)$/, "$1,");

    _re = /(\d)(\d{3},)/;
    while (_re.test(_int)) {
        _int = _int.replace(_re, "$1,$2");
    }
    _value = _int + _decimal;
    _value = _value.replace(/,(\d*)$/, ".$1");
    return _value;
};