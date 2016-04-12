define(function (require,exports,module) {
    var MyListTask = {};
    MyListTask.init = function () {
        MyListTask.bindEvent();
    };
    MyListTask.bindEvent = function () {
        //遮罩
        $("#cancel-header").click(function () {
            $(".shade").css("display", "block");
        });
        $(".cencal").click(function () {
            $(".shade").css("display", "none");
        });
        //类型
        $("#type-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            //判断data的值
            var num = $("#type-a").data("type");
            if (num == "0") {
                $(".tab-type").css("display", "block");
                $("#type-a").data("type", "1");
                $(".all-type").click(function () {
                    var txt = $(".all-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
                $(".DY-type").click(function () {
                    var txt = $(".DY-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
                $(".DH-type").click(function () {
                    var txt = $(".DH-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
            } else {
                $(".tab-type").css("display", "none");
                $("#type-a").data("type", "0");
            }
        });
        //流程
        $("#flow-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            var num = $("#flow-a").data("flow");
            if (num=="0") {
                $(".flow-type").css("display", "block");
                $("#flow-a").data("flow", "1");             
                $(".all-flow").click(function () {
                    var name = $(".all-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".DY-flow").click(function () {
                    var name = $(".DY-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".DH-flow").click(function () {
                    var name = $(".DH-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".SC-flow").click(function () {
                    var name = $(".SC-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
            } else {
                $(".flow-type").css("display", "none");
                $("#flow-a").data("flow", "0");
            }
        });
        //筛选来源
        $("#screen-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $("#flow-a").data("flow", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            var num = $("#screen-a").data("screen");            
            if (num=="0") {
                $(".screen-type").css("display", "block");
                $("#screen-a").data("screen", "1");
                $(".all-screen").click(function () {
                    var name = $(".all-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".GC-screen").click(function () {
                    var name = $(".GC-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".ZH-screen").click(function () {
                    var name = $(".ZH-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".AL-screen").click(function () {
                    var name = $(".AL-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
            } else {
                $(".screen-type").css("display", "none");
                $("#screen-a").data("screen", "0");
            }
        });
        //高级筛选       
        $("#select-copy").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");           
            var num = $("#select-copy").data("select");            
            if (num=="0") {
                $("#tab-screen").css("display", "block");
                $("#select-copy").data("select", "1");
            } else {
                $("#tab-screen").css("display", "none");
                $("#select-copy").data("select", "0");
            }            
        });


        
        




    };
    module.exports = MyListTask;
});