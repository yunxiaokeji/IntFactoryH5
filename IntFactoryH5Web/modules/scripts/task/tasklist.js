define(function (require,exports,module) {
    //var Global = require("global");
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
            $(".cencal").text("确定");
            $(".txt-search").val("");
            $(".shade").show();
            $(".search").show();
        });

        //搜索判断
        $(".cencal").click(function () {
            List.params.pageIndex = 1;
            var name = $(this).text();
            if (name=="确定") {
                var txt = $(".txt-search").val();
                if (txt != "") {
                    $(".shade").hide();
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
            }         
            $(".shade").hide();
            return false;
        });

        //(搜索框)点击空白区域
        $(".shade").click(function () {
            $(".shade").hide();
            $(".search").hide();
        });

        //(下拉框)点击空白区域
        $(".mask-shade").click(function () {
            $(".dropdownlist").hide();
            $(".type-LX").data("type", "0");
            $(".flow-LC").data("flow", "0");
            $(".screen-JD").data("screen", "0");
            $(".select-copy").data("select", "0");
            $(".mask-shade").hide();
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
        $(".type-LX").click(function () {        
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".screen-type").empty();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $(".screen-JD").data("screen", "0");
            $(".tab-screen").css("display", "none");
            $(".select-copy").data("select", "0");
            //判断data的值
            var num = $(".type-LX").data("type");
            if (num == "0") {
                $(".tab-type").slideDown("slow");
                $(".type-LX").data("type", "1");
                $(".tab-type li").click(function () {
                    if ($(this).text()=="全部") {
                        $(".flow-a").text("流程");
                        $(".screen-a").text("流程阶段");
                    }
                    $(".type-a").text($(this).text());
                    $(".tab-type").css("display", "none");
                    $(".type-LX").data("type", "0");
                    $(".mask-shade").hide();
                });
            } else {
                $(".tab-type").slideUp("slow");
                $(".type-LX").data("type", "0");
                $(".mask-shade").hide();
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
                $(".flow-type").hide();
                $(".flow-LC").data("flow", "0");
            } else {
                //判读流程下拉框的类别
                var name = $(".type-a").text();                       
                if (name == "打样") {
                    $(".DH").hide();               
                } else if(name=="大货") {
                    $(".DY").hide();
                }
                //当点击此事件时,关闭其他下拉框
                $(".tab-type").css("display", "none");
                $(".type-LX").data("type", "0");
                $(".screen-type").css("display", "none");
                $(".screen-JD").data("screen", "0");
                $(".tab-screen").css("display", "none");
                $(".select-copy").data("select", "0");
                var num = $(".flow-LC").data("flow");
                if (num == "0") {
                    $(".flow-type").slideDown("slow");
                    $(".flow-LC").data("flow", "1");
                    $(".all-flow").click(function () {
                        $(".flow-a").text($(this).text());
                        $(".flow-type").css("display", "none");
                        $(".flow-LC").data("flow", "0");
                        $(".mask-shade").hide();
                    });
                } else {
                    $(".flow-type").slideUp("slow");
                    $(".flow-LC").data("flow", "0");
                    $(".mask-shade").hide();
                }
            }

        });

        //流程阶段下拉        
        $(".screen-JD").click(function () {
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $(".type-LX").data("type", "0");
            $(".flow-type").css("display", "none");
            $(".flow-LC").data("flow", "0");
            $(".tab-screen").css("display", "none");
            $(".select-copy").data("select", "0");
            //判断流程阶段下面有没有li
            var linum = $(".screen-type").find("li").length;
            if (linum > 0) {
                //判读流程下拉框的选项
                var name = $(".flow-a").text();
                if (name == "全部") {
                    $(".nodata").hide();
                } 
                var num = $(".screen-JD").data("screen");
                if (num == "0") {
                    $(".screen-type").slideDown("slow");
                    $(".screen-JD").data("screen", "1");
                    $(".all-screen").click(function () {
                        $(".screen-a").text($(this).text());
                        $(".screen-type").css("display", "none");
                        $(".screen-JD").data("screen", "0");
                        $(".mask-shade").hide();
                    });
                } else {
                    $(".screen-type").slideUp("slow");
                    $(".screen-JD").data("screen", "0");
                    $(".mask-shade").hide();
                }
            } else {
                $(".screen-type").css("display", "none");
                $(".mask-shade").hide();
            }
        });

        //排序下拉       
        $(".select-copy").click(function () {
            List.params.pageIndex = 1;
            $(".mask-shade").show();
            $(".dropdownlist").show();
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $(".type-LX").data("type", "0");
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $(".screen-JD").data("screen", "0");
            //滑动事件
            var num = $(".select-copy").data("select");
            if (num == "0") {
                $(".tab-screen").slideDown("slow");
                $(".select-copy").data("select", "1");
                $(".tab-screen li").click(function () {
                    $(".sort-a").text($(this).text());
                    $(".tab-screen").slideUp("slow");
                    $(".select-copy").data("select", "0");
                    $(".mask-shade").hide();
                });
            } else {
                $(".tab-screen").slideUp("slow");
                $(".select-copy").data("select", "0");
                $(".mask-shade").hide();
            }

        });

        //获取全部状态的任务列表
        $(".task-status li").click(function () {
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").hide();
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            $(".task-status li").find(".iconfont").css("color", "#666");
            $(".task-status li").find("a").css("color", "#666");
            $(this).find(".iconfont").css("color", "#007aff");
            $(this).find("a").css("color", "#007aff");
            List.params.finishStatus = $(this).data("status");
            List.getList();
        });

        //获取类型的任务列表(+读取订单流程的列表[不是详情])
        $(".tab-type li").click(function () {
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").hide();
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            List.params.orderType = $(this).data("id");
            List.getList();
            List.GetTaskFlow();
        });

        //获取订单流程的任务列表(+读取订单流程阶段的列表[不是详情])
        $(".flow-type").on("click", ".all-flow", function () {
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").hide();
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            List.params.orderProcessID = $(this).data("id");
            List.getList();
            List.GetTaskFlowStage();
        });

        //获得订单流程阶段的任务列表
        $(".screen-type").on("click", ".all-screen", function () {
            //判断搜索结果
            if (List.keyWordsIsTrue == false) {
                List.params.keyWords = "";
                $(".search").hide();
            } else {
                List.params.keyWords;
            }
            List.params.pageIndex = 1;
            List.params.orderStageID = $(this).data("id");
            List.getList();
        });

        //获取排序的任务列表
        $(".tab-screen li").click(function () {
            List.params.isAsc = $(this).data("takepo");
            List.params.taskOrderColumn = $(this).data("id");
            List.getList();

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
                if (!List.isLoading) {
                    List.params.pageIndex++;
                    if (List.params.pageIndex <= List.pageCount) {
                        List.getList(true);
                    }else {
                        alert("已经到页低啦");                                                
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
            if (data.items.length==0) {
                $(".list").append("<div class='nodata'>暂无数据 !</div>");
                List.keyWordsIsTrue = false;
            } else {
                //分页数据
                List.pageCount = data.pageCount;
                List.totalCount = data.totalCount;
                doT.exec("../modules/template/task/taskListTemplate.html", function (code) {
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
            doT.exec("../modules/template/task/taskFlowTemplate.html", function (e) {
                var $res = e(data.items);
                $(".flow-type").append($res);
            });
        });
    }

    //获取订单流程的任务列表
    List.GetTaskFlowStage = function () {
        $(".screen-type").empty();
        $.post("/Task/GetTaskFlowStage", { processID: List.params.orderProcessID }, function (data) {            
            doT.exec("../modules/template/task/taskFlowStageTemplate.html", function (code) {
                var $res = code(data.items);
                $(".screen-type").append($res);
            });
        });
    }

    module.exports = List;
});