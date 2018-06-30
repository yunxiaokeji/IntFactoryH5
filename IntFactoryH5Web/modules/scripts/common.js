
var Global = {};
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


