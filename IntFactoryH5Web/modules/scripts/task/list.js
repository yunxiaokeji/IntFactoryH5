define(function (require,exports,module) {
    var Global = require("global");
    var List = {};
    List.params = {
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
    
    List.init = function () {
        List.getList();
        List.bindEvent();
    };

    List.pageCount = 0;

    List.totalCount = 0;

    List.isLoading = false;

    List.keyWordsIsTrue = true;

    List.bindEvent = function () {

        //遮罩
        $(".iconfont-search").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist").hide();
            $(".dropdownlist li").data("id", "0");
            $(".login").hide();
            $(".login").data("login", "0");
            $(".cencal").text("确定");
            $(".txt-search").val("");
            $(".shade").show();
            $(".search").show();
            $(".span-search").css("width", (document.body.clientWidth - 150) + "px");
            $(".txt-search").focus();
        });

        //用户退出下拉框    
        $(".login-menu").click(function () {
            $(".mask-shade").show();
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist").hide();
            $(".dropdownlist li").data("id", "0");
            var loginnum = $(".login").data("login");
            if (loginnum=="0") {
                $(".login").slideDown("slow");
                $(".login").data("login","1");
            } else {
                $(".login").slideUp("slow");
                $(".login").data("login", "0");
            }           
        });

        //搜索判断
        $(".cencal").click(function () {
            List.params.pageIndex = 1;
            var name = $(this).text();
            if (name=="确定") {
                var txt = $(".txt-search").val();
                if (txt != "") {
                    $(".shade").slideUp("slow");
                    List.params.keyWords = txt;
                    List.getList();
                    $(this).text("取消");
                    $(".txt-search").keyup(function () {
                        if ($(".txt-search").val()=="") {
                            $(".cencal").text("取消");
                        } else {
                            $(".cencal").text("确定");
                        }                        
                    });                    
                } else {
                    $(".search").slideUp("slow");
                }
            } else {
                $(".search").slideUp("slow");
            }         
            $(".shade").slideUp("slow");
            return false;
        });

        //(搜索框)点击空白区域
        $(".shade").click(function () {
            $(".shade").slideUp("slow");
            $(".search").slideUp("slow");
        });

        //(下拉框)点击空白区域
        $(".mask-shade").click(function () {
            $(".dropdownlist").hide();
            $(".dropdownlist li").data("id", "0");
            $(".login").hide();
            $(".login").data("login", "0");
            $(".mask-shade").hide();
        });        
        
        //(搜索框)冒泡事件
        $(".span-search").click(function () {
            return false;
        });
        
        //类型下拉 
        $(".type-LX").click(function () {        
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".screen-type").empty();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist ul").siblings().hide();
            $(this).data("id", "0");
            var num = $(this).data("id");         
            if (num == "0") {
                $(".tab-type").slideDown("slow");
            } 
        });

        //流程下拉 
        $(".flow-LC").click(function () {
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".dropdownlist").show();
            //判断流程下面有没有li
            var liflow = $(".flow-type").find("li").length;
            if (liflow=="") {
                $(".flow-type").slideUp("slow");
                $(".flow-LC").data("id", "0");
            } else {
                //判读流程下拉框的类别
                var name = $(".type-a").text();
                if (name == "打样") {
                    $(".DH").hide();
                } else if (name == "大货") {
                    $(".DY").hide();
                }
                //当点击此事件时,关闭其他下拉框
                $(".dropdownlist ul").siblings().hide();
                $(this).data("id", "0");
                var num = $(this).data("id");
                if (num == "0") {
                    $(".flow-type").slideDown("slow");
                } 
            }
        });

        //流程阶段下拉        
        $(".screen-JD").click(function () {
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist ul").siblings().hide();
            $(this).data("id", "0");
            //判断流程阶段下面有没有li
            var linum = $(".screen-type").find("li").length;
            if (linum > 0) {
                //判读流程下拉框的选项
                var name = $(".flow-a").text();
                if (name != "") {
                    $(".screen-type .nodata").remove();
                } 
                var num = $(this).data("id");
                if (num == "0") {
                    $(".screen-type").slideDown("slow");                    
                }
            } else {
                $(".screen-type").slideUp("slow");
                $(".mask-shade").hide();
            }
        });

        //排序下拉       
        $(".select-copy").click(function () {
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist ul").siblings().hide();
            $(this).data("id", "0");
            //滑动事件
            var num = $(".select-copy").data("id");
            if (num == "0") {
                $(".tab-screen").slideDown("slow");
            }
        });

        //获取全部状态的任务列表
        $(".task-status li").click(function () {
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").slideUp("slow");
            } else {
                List.params.keyWords;
            }
            //初始化
            List.params.pageIndex = 1;
            List.params.orderProcessID = -1;
            List.params.orderStageID = -1;
            List.params.orderType = -1;
            $(".task-status li").find(".iconfont").css("color", "#666");
            $(".task-status li").find("a").css("color", "#666");
            $(this).find(".iconfont").css("color", "#007aff");
            $(this).find("a").css("color", "#007aff");
            List.params.finishStatus = $(this).data("status");
            List.getList();
        });

        //获取类型的任务列表(+读取订单流程的列表[不是详情])
        $(".tab-type li").click(function () {
            if ($(this).text() != "") {
                $(".flow-a").text("流程");
                $(".screen-a").text("流程阶段");
            }
            $(".type-a").text($(this).text());
            $(".tab-type").slideUp("slow");
            $(".type-LX").data("id", "0");
            $(".mask-shade").hide();
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").slideUp("slow");
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            List.params.orderProcessID = -1;
            List.params.orderStageID = -1;
            List.params.orderType = $(this).data("idtype");
            List.getList();
            List.GetTaskFlow();
        });

        //获取订单流程的任务列表(+读取订单流程阶段的列表[不是详情])
        $(".flow-type").on("click", ".all-flow", function () {
            if ($(this).text() != "") {
                $(".screen-a").text("流程阶段");
            }
            $(".flow-a").text($(this).text());
            $(".flow-type").slideUp("slow");
            $(".flow-LC").data("id", "0");
            $(".mask-shade").hide();
            //数据
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").slideUp("slow");
            } else {
                List.params.keyWords;
            }
            List.params.orderType = -1;
            List.params.pageIndex = 1;
            List.params.orderStageID = -1;            
            List.params.orderProcessID = $(this).data("id");
            List.getList();
            List.GetTaskFlowStage();
        });

        //获得订单流程阶段的任务列表
        $(".screen-type").on("click", ".all-screen", function () {
            $(".screen-a").text($(this).text());
            $(".screen-type").slideUp("slow")
            $(".screen-JD").data("id", "0");
            $(".mask-shade").hide();
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").slideUp("slow");
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            List.params.orderStageID = $(this).data("id");
            List.getList();
        });

        //获取排序的任务列表
        $(".tab-screen li").click(function () {
            $(".sort-a").text($(this).text());
            $(".tab-screen").slideUp("slow");
            $(".select-copy").data("id", "0");
            $(".mask-shade").hide();
            List.params.isAsc = $(this).data("takepo");
            List.params.taskOrderColumn = $(this).data("id");
            List.getList();

        });

        //点击回到顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });

        //滚动条在最下面时增加数据
        $(window).scroll(function () {
            //判断滚动条发生变化时
            if (document.body.scrollTop > 0) {
                $(".getback").slideDown("slow");
            } else {
                $(".getback").slideUp("slow");
            }
            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();            
            if (bottom <= 1) {
                if (!List.isLoading) {
                    List.params.pageIndex++;
                    if (List.params.pageIndex <= List.pageCount) {
                        List.getList(true);
                    } else {
                        $(".prompt").remove();
                        $(".list").append('<div class="prompt">已经到页面底部啦</div>');
                    }
                } 
            }
        });

    };

    ///公共方法
   
    //页面加载获取列表
    List.getList = function (noEmpty) {
        List.isLoading = true;
        if (!noEmpty) {
            $(".list").empty();
        }        
        //获取任务列表(页面加载)
        $(".list").append('<div class="listbg mTop20"></div>');
        $.post("/Task/GetTask", { filter: JSON.stringify(List.params) }, function (data) {
            //获取用户名
            $(".login-name").text(data.userName);
            if (data.items.length==0) {
                $(".list").append("<div class='nodata'>暂无数据 !</div>");
                List.keyWordsIsTrue = false;
            } else {               
                //分页数据
                List.pageCount = data.pageCount;
                List.totalCount = data.totalCount;
                //引用doT模板
                doT.exec("../modules/template/task/List.html", function (code) {
                    var $result = code(data.items);
                    $(".list").append($result);
                });
                List.isLoading = false;
                List.keyWordsIsTrue = true;
            }            
            $(".listbg").remove();
        });        
    }

    //获取订单流程的列表
    List.GetTaskFlow = function () {
        $(".flow-type").empty();
        $.post("/Task/GetTaskFlow", null, function (data) {            
            doT.exec("../modules/template/task/Flow.html", function (e) {
                var $res = e(data.items);
                $(".flow-type").append($res);
            });
        });
    }

    //获取订单流程的任务列表
    List.GetTaskFlowStage = function () {
        $(".screen-type").empty();
        $.post("/Task/GetTaskFlowStage", { processID: List.params.orderProcessID }, function (data) {            
            doT.exec("../modules/template/task/FlowStage.html", function (code) {
                var $res = code(data.items);
                $(".screen-type").append($res);
            });
        });
    }

    module.exports = List;
});