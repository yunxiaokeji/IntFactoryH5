
var Global = {};
Global.setCookie = function (name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

Global.getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

Global.delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Global.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

Global.isDouble = function (str) {
    return str.match(/^\d+(.\d+)?$/);
}

Global.validateMobilephone = function (mobilephone) {
    var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;

    return reg.test(mobilephone);
}

Global.GetQueryString=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


Global.getCurrentUser = function () {
    var userinfo = Global.getCookie("userinfo");
    if (userinfo) {
        userinfo = JSON.parse(userinfo);
    } else {
        userinfo = {};
    }

    return userinfo;
}

Global.currentUser = Global.getCurrentUser();


