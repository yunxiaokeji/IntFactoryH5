﻿define(function (require,exports,module) {
    var MyListTask = {};

    MyListTask.params = {
        keyWords: "",
        isMy: true,
        userID: "",
        taskType: -1,
        colorMark: -1,
        status: 1,
        finishStatus: -1,
        beginDate: "",
        endDate: "",
        orderType: -1,
        orderProcessID: "-1",
        orderStageID: "-1",
        taskOrderColumn: 0,
        isAsc: 0,
        pageSize: 5,
        pageIndex: 1,
        mark:0,
    };

    MyListTask.init = function () {
        MyListTask.getList();
        MyListTask.bindEvent();        
    };

    MyListTask.pageCount = 0;

    MyListTask.totalCount = 0;

    MyListTask.isLoading = false;

    MyListTask.bindEvent = function () {

        //遮罩
        $("#cancel-header").click(function () {
            $(".shade").css("display", "block");
        });
        $(".cencal").click(function () {
            var txt = $(".txt-search").val();
            MyListTask.params.keyWords = txt;
            MyListTask.getList();
            $(".shade").css("display", "none");
            return false;
        });

        //(搜索框)点击空白区域
        $(".shade").click(function () {
            $(".shade").css("display", "none");
        });
        $(".maskshade").click(function () {
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $("#flow-a").data("flow", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $(".tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            $(".maskshade").hide();
        });

        //(搜索框)冒泡事件
        $(".span-search").click(function () {
            return false;
        });

        //(下拉框)冒泡事件
        $(".select-box").click(function () {
            return false;
        });        

        //类型下拉 
        $("#type-a").click(function () {
            MyListTask.params.pageIndex = 1;
            $(".maskshade").show();
            $("#screen-potion").empty();
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
                $(".tab-type").slideDown("slow");
                $("#type-a").data("type", "1");
                $(".tab-type li").click(function () {
                    $(".type-a").text($(this).text());
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                    $(".maskshade").hide();
                });
            } else {
                $(".tab-type").slideUp("slow");
                $("#type-a").data("type", "0");
                $(".maskshade").hide();
            }
        });

        //流程下拉 
        $("#flow-a").click(function () {
            MyListTask.params.pageIndex = 1;
            $(".maskshade").show();
            //判读流程下拉框的类别
            var name = $(".type-a").text();                       
            if (name == "打样") {
                $(".DH").hide();               
            } else if(name=="大货") {
                $(".DY").hide();
            }
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            var num = $("#flow-a").data("flow");
            if (num == "0") {
                $(".flow-type").slideDown("slow");
                $("#flow-a").data("flow", "1");
                $(".all-flow").click(function () {
                    $(".flow-a").text($(this).text());
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                    $(".maskshade").hide();
                });
            } else {
                $(".flow-type").slideUp("slow");
                $("#flow-a").data("flow", "0");
                $(".maskshade").hide();
            }
        });

        //流程阶段下拉        
        $("#screen-a").click(function () {
            MyListTask.params.pageIndex = 1;
            $(".maskshade").show();
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $("#flow-a").data("flow", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            //判断流程阶段下面有没有li
            var linum = $(".screen-type").find("li").length;
            if (linum > 0) {
                var num = $("#screen-a").data("screen");
                if (num == "0") {
                    $(".screen-type").slideDown("slow");
                    $("#screen-a").data("screen", "1");
                    $(".all-screen").click(function () {
                        $(".screen-a").text($(this).text());
                        $(".screen-type").css("display", "none");
                        $("#screen-a").data("screen", "0");
                        $(".maskshade").hide();
                    });
                } else {
                    $(".screen-type").slideUp("slow");
                    $("#screen-a").data("screen", "0");
                    $(".maskshade").hide();
                }
            } else {
                $(".screen-type").css("display", "none");
                $(".maskshade").hide();
            }
        });

        //排序下拉       
        $("#select-copy").click(function () {
            MyListTask.params.pageIndex = 1;
            $(".maskshade").show();
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            //滑动事件
            var num = $("#select-copy").data("select");
            if (num == "0") {
                $("#tab-screen").slideDown("slow");
                $("#select-copy").data("select", "1");
                $(".tab-screen li").click(function () {
                    //判断浏览器宽度
                    var width = document.body.clientWidth;
                    if (width <= 550) {
                        $("#select-copy").css("margin-top", "3px");
                    }
                    else {
                        $("#select-copy").css("margin-top", "15px");
                    }
                    $(".sort-a").text($(this).text());
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                    $(".maskshade").hide();
                });
            } else {
                $("#tab-screen").slideUp("slow");
                $("#select-copy").data("select", "0");
                $(".maskshade").hide();
            }

        });

        //点击全部流程下的[全部]时获取列表(页面初次加载的时候)
        $("#all-flow-drop").click(function () {
            MyListTask.getList();
        });

        //获取全部状态的任务列表
        $(".task-status li").click(function () {
            MyListTask.params.pageIndex = 1;
            $(".task-status li").find(".iconfont").css("color", "#666");
            $(".task-status li").find("a").css("color", "#666");
            $(this).find(".iconfont").css("color", "#007aff");
            $(this).find("a").css("color", "#007aff");
            MyListTask.params.finishStatus = $(this).data("status");
            MyListTask.getList();
        });

        //获取类型的任务列表(+读取订单流程的列表[不是详情])
        $(".tab-type li").click(function () {
            MyListTask.params.orderType = $(this).data("id");
            MyListTask.getList();
            MyListTask.GetTaskFlow();
        });

        //获取订单流程的任务列表(+读取订单流程阶段的列表[不是详情])
        $("#flow-potion").on("click", ".all-flow", function () {
            MyListTask.params.orderProcessID = $(this).data("id");            
            MyListTask.getList();
            MyListTask.GetTaskFlowStage();
        });

        //获得订单流程阶段的任务列表
        $("#screen-potion").on("click", ".all-screen", function () {            
            MyListTask.params.orderStageID = $(this).data("id");            
            MyListTask.getList();
        });

        //获取排序的任务列表
        $(".tab-screen li").click(function () {
            MyListTask.params.isAsc = $(this).data("takepo");
            MyListTask.params.taskOrderColumn = $(this).data("id");
            MyListTask.getList();

        });

        //点击回到顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
            $(".getback").css("display", "none");
        });

        //滚动条在最下面时增加数据
        $(window).scroll(function () {
            //判断滚动条发生变化时
            if (document.body.scrollTop > 0) {
                $(".getback").show();
            } else {
                $(".getback").hide();
            }
            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();            
            if (bottom <= 1) {
                if (!MyListTask.isLoading) {
                    MyListTask.params.pageIndex++;
                    if (MyListTask.params.pageIndex <= MyListTask.pageCount) {                        
                        MyListTask.getList(true);
                    }else {
                        alert("已经到页低啦");                                                
                    }
                } 
            }
        });

    };
    ///公共方法
   
    //页面加载获取列表
    MyListTask.getList = function (noEmpty) {
        MyListTask.isLoading = true;
        if (!noEmpty) {
            $(".list").empty();
        }        
        //获取任务列表(页面加载)
        $(".list").append('<div class="listbg"></div>');
        $.post("/Task/GetTask", { filter: JSON.stringify(MyListTask.params) }, function (data) {
            if (data.items.length==0) {
                $(".list").append("<div class='nodata'>暂无数据!</div>");
            } else {
                //分页数据
                MyListTask.pageCount = data.pageCount;
                MyListTask.totalCount = data.totalCount;           
                doT.exec("../modules/template/task/taskListTemplate.html", function (code) {
                    var $result = code(data.items);
                    $(".list").append($result);
                });
                MyListTask.isLoading = false;                
            }            
            $(".listbg").remove();
        });        
    }

    //获取订单流程的列表
    MyListTask.GetTaskFlow = function () {
        $("#flow-potion").empty();
        $.post("/Task/GetTaskFlow", null, function (data) {            
            doT.exec("../modules/template/task/taskFlowTemplate.html", function (e) {
                var $res = e(data.items);
                $("#flow-potion").append($res);
            });
        });
    }

    //获取订单流程的任务列表
    MyListTask.GetTaskFlowStage = function () {
        $("#screen-potion").empty();
        $.post("/Task/GetTaskFlowStage", { processID: MyListTask.params.orderProcessID }, function (data) {            
            doT.exec("../modules/template/task/taskFlowStageTemplate.html", function (code) {
                var $res = code(data.items);
                $("#screen-potion").append($res);
            });
        });
    }

    module.exports = MyListTask;
});