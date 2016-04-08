define(function (require,exports,module) {
    var myListTask = {};
    myListTask.init = function () {
        myListTask.bindEvent();
    };
    myListTask.bindEvent = function () {
        //鼠标滑动事件
        $(".all").hover(function () {
            $(".all-a").css("color", "#007aff").css("cursor", "pointer");
            $(".iconfont-all").css("color", "#007aff").css("cursor", "pointer");
        });
        $(".unreceived").hover(function () {
            $(".unreceived-a").css("color", "#007aff").css("cursor", "pointer");
            $(".inquadrangle").css("background-color", "#007aff").css("cursor", "pointer");
            $(".exround").css("border", "1px solid #007aff").css("cursor", "pointer");
        });
        $(".underway").hover(function () {
            $(".underway-a").css("color", "#007aff").css("cursor", "pointer");
            $("#iconfont-underway").css("color", "#007aff").css("cursor", "pointer");
        });
        $(".accomplish").hover(function () {
            $(".accomplish-a").css("color", "#007aff").css("cursor", "pointer");
            $("#iconfont-underway-accom").css("color", "#007aff").css("cursor", "pointer");
        });
        $(".type").hover(function () {
            $(".type-a").css("color", "#007aff").css("cursor", "pointer");
            $("#iconfont-type").css("color", "#007aff").css("cursor", "pointer");
        });
        $(".flow").hover(function () {
            $(".flow-a").css("color", "#007aff").css("cursor", "pointer");
            $("#iconfont-flow").css("color", "#007aff").css("cursor", "pointer");
        });
        $(".screen").hover(function () {
            $(".screen-a").css("color", "#007aff").css("cursor", "pointer");
            $("#iconfont-screen").css("color", "#007aff").css("cursor", "pointer");
        });
        //鼠标离开事件
        $(".all").mouseleave(function () {
            $(".all-a").css("color", "#666");
            $(".iconfont-all").css("color", "#666");
        });
        $(".unreceived").mouseleave(function () {
            $(".unreceived-a").css("color", "#666");
            $(".inquadrangle").css("background-color", "#666");
            $(".exround").css("border", "1px solid #666");
        });
        $(".underway").mouseleave(function () {
            $(".underway-a").css("color", "#666");
            $("#iconfont-underway").css("color", "#666");
        });
        $(".accomplish").mouseleave(function () {
            $(".accomplish-a").css("color", "#666");
            $("#iconfont-underway-accom").css("color", "#666");
        });
        $(".type").mouseleave(function () {
            $(".type-a").css("color", "#999");
            $("#iconfont-type").css("color", "#999");
        });
        $(".flow").mouseleave(function () {
            $(".flow-a").css("color", "#999");
            $("#iconfont-flow").css("color", "#999");
        });
        $(".screen").mouseleave(function () {
            $(".screen-a").css("color", "#999");
            $("#iconfont-screen").css("color", "#999");
        });
    };
    module.exports = myListTask;
});