define(function (require,exports,module) {
    var Global = require("global");

    var List = {};

    List.pageCount = 0;
   
    List.isLoading = false;

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
        mark: 0,
        isParticipate:false,
    };
    
    List.init = function () {
        List.bindEvent();

        List.getList();
        List.getTaskFlow();
        
    };


    List.bindEvent = function () {

        //遮罩
        $(".iconfont-search").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".potion").slideUp("slow");
            $(".login").slideUp("slow");
            $(".task-switch").slideUp("slow");
            $(".cencal").text("确定");
            $(".txt-search").val("");
            $(".shade").show();
            $(".search").show();
            $(".span-search").css("width", (document.body.clientWidth - 150) + "px");
            $(".txt-search").focus();
        });

        //用户退出  
        $(".login-menu").click(function () {
            $(".dropdownlist .potion").slideUp("slow");
            $(".task-switch").slideUp("slow");
            $(".login").slideToggle(400);               
        });

        //切换用户任务
        $(".task").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".dropdownlist .potion").slideUp("slow");
            $(".login").slideUp("slow");
            $(".task-switch").slideToggle(400);            
        });

        //选择用户任务类型(判断是否是我参与的)
        $(".task-switch li").click(function () {
            $(".task span").text($(this).text());
            $(this).parent().hide();
            var switchnum = $(this).data("switch");
            if (switchnum==0) {
                List.params.isParticipate = false;
            } else {
                List.params.isParticipate = true;
            }
            List.getList();
        });

        //(关键字)搜索判断
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
                    $(".search").hide();
                }
            } else {
                $(".search").hide();
                List.params.keyWords = "";
            }         
            $(".shade").hide();
            return false;
        });

        //(搜索框)点击空白区域
        $(".shade").click(function () {
            $(".shade").hide();
            $(".search").hide();
        });

        //下拉
        $(".select li").click(function () {
            List.params.pageIndex = 1;
            var $slideUl = $("." + $(this).data("idnum") + "");
            $slideUl.slideToggle(400).siblings().slideUp("slow");
        });

        //获取全部状态的任务列表
        $(".task-status li").click(function () {
            $(this).siblings().find(".iconfont,a").css("color", "#666");
            $(this).find(".iconfont,a").css("color", "#007aff");

            List.params.pageIndex = 1;
            List.params.finishStatus = $(this).data("status");
            List.getList();
        });

        //获取类型的任务列表
        $(".tab-type li").click(function () {
            $(".flow-span").text("流程");
            $(".screen-span").text("流程阶段");

            $(".type-span").text($(this).text());
            $(this).parent().hide();
            
            List.params.pageIndex = 1;
            List.params.orderType = $(this).data("idtype");
            List.params.orderProcessID = -1;
            List.params.orderStageID = -1;
            List.getList();

            //判断流程分类
            if (List.params.orderType == 1) {
                $(".flow-type .DH").hide();
                $(".flow-type .DY").show();
            } else if (List.params.orderType == 2) {
                $(".flow-type .DH").show();
                $(".flow-type .DY").hide();
            }
        });

        //获取订单流程的任务列表(+读取订单流程阶段的列表[不是详情])
        $(".flow-type").on("click", ".all-flow", function () {
            $(".screen-span").text("流程阶段");
            $(".flow-span").text($(this).text());

            $(this).parent().hide();
            
            List.params.pageIndex = 1;
            List.params.orderStageID = -1;
            List.params.orderProcessID = $(this).data("idflow");
            List.getList();
            List.getTaskFlowStage();
        });

        //获得订单流程阶段的任务列表
        $(".screen-type").on("click", ".all-screen", function () {
            $(".screen-span").text($(this).text());
            $(this).parent().hide();
            
            List.params.pageIndex = 1;
            List.params.orderStageID = $(this).data("id");
            List.getList();
        });

        //获取排序的任务列表
        $(".screen-sort li").click(function () {
            $(".sort-span").text($(this).text());
            $(this).parent().hide();
            
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
            if (bottom <= 200) {
                if (!List.isLoading) {
                    List.params.pageIndex++;
                    if (List.params.pageIndex <= List.pageCount) {
                        List.getList(true);
                    } else {
                        $(".prompt").remove();
                        $(".list").append('<div class="prompt">已经到最后一条啦</div>');
                    }
                } 
            }
        });

        //监听页面click事件
        $(document).click(function (e) {
            if (!$(e.target).parents().hasClass("login-menu") && !$(e.target).hasClass("login-menu")) {
                $(".login").slideUp(400);
            }

            if (!$(e.target).parents().hasClass("select") && !$(e.target).hasClass("select")) {
                $(".potion").slideUp(400);
            }

            if (!$(e.target).parents().hasClass("task") && !$(e.target).hasClass("task")) {
                $(".task-switch").slideUp(400);
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
            //判断有无数据
            if (data.items.length==0) {
                $(".list").append("<div class='nodata'>暂无数据 !</div>");
            } else {               
                //分页数据
                List.pageCount = data.pageCount;
                //引用doT模板
                doT.exec("../modules/template/task/list.html", function (code) {
                    var $result = code(data.items);
                    $(".list").append($result);
                });
                List.isLoading = false;
            }            
            $(".listbg").remove();
        });        
    }

    //获取订单流程的列表
    List.getTaskFlow = function () {
        $(".flow-type").empty();
        $.post("/Task/GetTaskFlow", null, function (data) {
            doT.exec("../modules/template/task/flow.html", function (e) {
                var $res = e(data.items);
                $(".flow-type").append($res);
            });
        });
    }

    //获取订单流程的任务列表
    List.getTaskFlowStage = function () {
        $(".screen-type").empty();
        $.post("/Task/GetTaskFlowStage", { processID: List.params.orderProcessID }, function (data) {
            doT.exec("../modules/template/task/flowStage.html", function (code) {
                var $res = code(data.items);                
                $(".screen-type").append($res);
            });
        });
    }

    module.exports = List;
});