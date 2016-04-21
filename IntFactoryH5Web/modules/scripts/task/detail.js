define(function (require, exports, module) {

    var Global = require("global");
        
    var Paras = {
        orderID: "",
        stageID: "",     
        replayPageIndex: 1,
        logPageIndex:1,
        endTime: "",
        taskID:""
    };
    
    var AddReplyParas = {
        orderID: "",
        stageID: "",
        mark: "",
        content: "",
        fromReplyID: "",
        fromReplyUserID: "",
        fromReplyAgentID:""
    };

    var Content = "";

    var TaskDetail = {};

    //判断日志第一次加载
    var LogIsPageCount = true;

    var ReplyIsPageCount = true;
    
    $replyPageCount = 1;

    $logPageCount = 1;
    
    TaskDetail.init = function (imgStatus, userID, materialList, operateStatus, jsonTask) {

        var jsonTask = JSON.parse(jsonTask.replace(/&quot;/g, '"'));
        Paras.orderID = jsonTask.orderID;
        Paras.stageID = jsonTask.stageID;
        Paras.taskID = jsonTask.taskID;

        TaskDetail.imgStatus = imgStatus;
        TaskDetail.userID = userID;
        TaskDetail.operateStatus = operateStatus;
        TaskDetail.materialList = JSON.parse(materialList.replace(/&quot;/g, '"'));

        AddReplyParas.orderID = jsonTask.orderID;
        AddReplyParas.stageID = jsonTask.stageID;
        AddReplyParas.mark = jsonTask.mark;

        TaskDetail.bindEvent();

        //浏览器加载获取讨论列表
        TaskDetail.getTaskReplys();

        //浏览器加载获取材料信息
        TaskDetail.getOrderList(TaskDetail.materialList);
        
        //浏览器加载删除制版信息操作列
        TaskDetail.printBaseInfo();

        //调用绑定选择时间控件(绑定设置到期时间事件)
        TaskDetail.bindTimerPicker();
        
        TaskDetail.setImagesSize();


    }
   
    //绑定事件
    TaskDetail.bindEvent = function () {

        //是否绑定滑屏控件事件
        if (TaskDetail.imgStatus == 1) {
            $dragBln = false;
            $(".main_image").touchSlider({
                flexible: true,
                speed: 200,
                //btn_prev: $("#btn_prev"),
                //btn_next: $("#btn_next"),
                paging: $(".flicking_con a"),
                counter: function (e) {
                    $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
                }
            });
        }

        //菜单切换模块事件
        $("nav ul li").click(function () {
            
            $(this).addClass("menuchecked").siblings().removeClass("menuchecked");
            $(this).parent().parent().find("i").css("color", "#9e9e9e");
            $(this).find("i").css("color", "#4a98e7");
            var classname = $(this).data("classname");
            $(".main-box ." + classname).show().siblings().hide();

            //点击讨论模块
            if (classname == "talk-status") {
                $(".main-box").css("margin-bottom", "60px");
                $(window).unbind("scroll");
                TaskDetail.bindScroll('bindReply');
            }

            //点击材料计划模块
            else if (classname == "shop-status")
            {
                $(".main-box .loading-lump").hide();
                $(window).unbind("scroll");
            }

            //点击日志模块
            else if (classname == "log-status") {

                if (LogIsPageCount) {
                    TaskDetail.getTaskLogs();
                    LogIsPageCount = false;
                }
                $(".main-box").css("margin-bottom", "0px");
                $(window).unbind("scroll");
                TaskDetail.bindScroll('bindLog');
            }

            //点击制版模块
            else if (classname == "print-status") {
                $(window).unbind("scroll");
            }

        })

        //点击提交按钮
        $(".btn-submit").bind("click",function () {
            
            AddReplyParas.content = $(".txt-talkcontent").val().replace(Content, "");

            if (AddReplyParas.content == "") { return; }

            if ($(".txt-talkcontent").val().indexOf(Content) != 0) {

                AddReplyParas.fromReplyID = "";

                AddReplyParas.fromReplyUserID = "";

                AddReplyParas.fromReplyAgentID = "";

            }
            var msgReply = JSON.stringify(AddReplyParas);
            $(this).val("提交中...").attr("disabled", "disabled");
            $.post("/Task/AddTaskReply", { resultReply: msgReply }, function (data) {

                    doT.exec("/template/task/detailReply.html", function (templateFun) {
                        $(".btn-submit").val("提交").removeAttr("disabled");
                        var dataReplys = {};
                        dataReplys.items = data.items;
                        dataReplys.userID = TaskDetail.userID;
                        var innerText = templateFun(dataReplys);

                        if ($(".talk-main").find('div').length == 0) {
                            $(".noreply-msg").hide();
                        }

                        $(".talk-main").prepend(innerText);

                        $(".txt-talkcontent").val("");

                        //点击回复把用户名写入文本框
                        $(".talk-content .talk-main .iconfont").bind("click", function () {

                            AddReplyParas.fromReplyID = $(this).data("replyid");

                            AddReplyParas.fromReplyUserID = $(this).data("userid");

                            AddReplyParas.fromReplyAgentID = $(this).data("agentid");

                            Content = "@" + $(this).data("name") + " ";

                            $(".txt-talkcontent").val(Content);

                            $(".txt-talkcontent").focus();

                        });

                    });

            })

        })
     
        //绑定完成任务
        if ($(".btn-finishTask").length > 0) {
            $(".task-accept").css({ "border": "1px solid #e0483e" });
            if ($('.btn-finishTask').val() == "标记完成") {
                if (TaskDetail.operateStatus) {
                    $(".btn-finishTask").click(function () {
                        TaskDetail.showConfirmForm(1);
                    });
                }
            }
        }
        else {
            $(".task-accept").css({ "border": "none"});
        }
    }

    //窗体加载绑定讨论下拉
    TaskDetail.bindScroll = function (bind) {

        $(window).bind("scroll", function () {

            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();

            if (bottom <= 20) {
                //$("#tableLoad").attr("class", "");
                setTimeout(function () {
                    $(".main-box .loading-lump").show().css("margin-bottom", "10px");
                    if (bind == "bindReply")
                    {
                        Paras.replayPageIndex++;
                        TaskDetail.getTaskReplys();
                    }
                    else if (bind == "bindLog")
                    {
                        Paras.logPageIndex++;
                        TaskDetail.getTaskLogs();
                    }
                }, 1000);
            }

        });

    }

    //绑定时间控件
    TaskDetail.bindTimerPicker = function () {

        if ($(".btn-acceptTaskTime").length == 0) { return; }
        if (!TaskDetail.operateStatus) { return;}
        $(".task-accept").css({ "border": "1px solid #e0483e" });
        var defaultParas = {
            preset: 'datetime',
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            lang: 'zh',
            onSelect: function () {

                Paras.endTime = $(".btn-acceptTaskTime").val();

                TaskDetail.showConfirmForm(0);

                $(".btn-acceptTaskTime").val("接受任务");

            }
        };
        $(".btn-acceptTaskTime").mobiscroll().datetime(defaultParas);
    }

    //设置任务到期时间
    TaskDetail.setTaskEndTime =function() {

        $.post("/Task/UpdateTaskEndTime", Paras, function (data) {
            
            if (data == 1) {
                $(".end-time").html(Paras.endTime);
                $(".accept-time").html(new Date().toString("yyyy-MM-dd hh:mm:ss"));
                $(".task-accept").html("<input type='text' class='btn-finishTask' name='appDateTime' value='标记完成' />");
                $(".task-accept").find(".btn-finishTask").bind('click',function () {
                    TaskDetail.finishTask();
                });
            }
            else if (data == 0)
            {
                alert("失败");
            }
            else if (data == 2)
            {
                alert("有前面阶段任务未完成");
            }
            else if(data==3)
            {    
                 alert("没有权限");
            }
            else if (data == 4)
            {
                alert("任务没有接受，不能设置完成");
            }
            else if (data == 5)
            {
                alert("任务有未完成步骤");
            }
        });

    }

    //标记完成任务
    TaskDetail.finishTask = function () {

        $.post("/Task/FinishTask", Paras, function (data) {
            if (data == 1) {
                $(".task-accept").html("<span>已完成</span>");
                $(".task-accept").unbind('click');
                $(".complete-time").html(new Date().toString("yyyy-MM-dd hh:mm:ss"));
                $(".task-accept").css({ "border": "none" })
            }
            else if (data == 0) {
                alert("失败");
            }
            else if (data == 2) {
                alert("有前面阶段任务未完成");
            }
            else if (data == 3) {
                alert("没有权限;");
            }
            else if (data == 4) {
                alert("任务没有接受，不能设置完成");
            }
            else if (data == 5) {
                alert("任务有未完成步骤");
            }
        });

    }

    //获取任务讨论列表
    TaskDetail.getTaskReplys = function () {

            $(".main-box .loading-lump").show();
            $.post("/Task/GetDiscussInfo", Paras, function (data) {
                $totalCount = data.totalcount;
                $replyPageCount = data.pagecount;
                if ($replyPageCount == 0) {
                    $(".noreply-msg").show();
                    $(".main-box .loading-lump").hide();
                }
                else {
                    if ($replyPageCount >= Paras.replayPageIndex) {
                        doT.exec("/template/task/detailReply.html", function (templateFun) {

                            var dataReplys = {};
                            dataReplys.items = data.items;
                            dataReplys.userID = TaskDetail.userID;
                            var innerText = templateFun(dataReplys);
                            //var innerText = templateFun(items);
                            innerText = $(innerText);

                            $(".talk-main").append(innerText);

                            innerText.find(".text-talk").each(function () {
                                $(this).html(Global.replaceQqface($(this).html()));
                            });

                            //点击回复把用户名写入文本框
                            $(".talk-content .talk-main .iconfont").bind("click", function () {

                                AddReplyParas.fromReplyID = $(this).data("replyid");

                                AddReplyParas.fromReplyUserID = $(this).data("userid");

                                AddReplyParas.fromReplyAgentID = $(this).data("agentid");

                                Content = "@" + $(this).data("name") + " ";

                                $(".txt-talkcontent").val(Content);

                                $(".txt-talkcontent").focus();

                            });

                            $(".main-box .loading-lump").hide();

                        });
                    }
                    else {
                        $(".main-box .loading-lump").hide();
                    }
                }
                if (ReplyIsPageCount)
                {
                    TaskDetail.bindScroll('bindReply');
                    ReplyIsPageCount = false;
                }
            })
    }
    
    //获取任务详情日志列表
    TaskDetail.getTaskLogs = function () {
    
        $(".main-box .loading-lump").show();
            $.post("/Task/GetLogInfo", Paras, function (data) {
                $logPageCount = data.pagecount;
                if ($logPageCount == 0) {
                    $(".log-status").html("<div class='no-log'>暂无数据</div>");
                }
                else {
                    if ($logPageCount >= Paras.logPageIndex) {

                        doT.exec("/template/task/detailLog.html", function (templateFun) {

                            var items = data.items;

                            var innerText = templateFun(items);

                            $('.log-status').append(innerText);
                        });

                    }
                }
                $(".main-box .loading-lump").hide();
            })

    }

    //获取材料采购计划列表
    TaskDetail.getOrderList = function (data) {
        
            if (data.length == 0) {
                $(".shop-status").html("<div class='no-material'>暂无材料</div>");
            }
            else {
                doT.exec("/template/task/materList.html", function (templateFun) {
                    var innerText = templateFun(data);
                    innerText = $(innerText);
                    $(".shop-status").html(innerText);
                    //设置采购计划图标点击事件
                    innerText.find(".material").click(function () {
                        var meterialLumpbox = $(this).find(".meterial-lumpbox");

                        if (!$(".material-main").is(":animated")) {
                            $(meterialLumpbox).parent().parent().siblings().slideToggle(500);
                            if ($(meterialLumpbox).data('status') == '0') {
                                $(meterialLumpbox).css("-webkit-transform", "rotate(90deg)");
                                $(meterialLumpbox).data('status', '1');
                                $(meterialLumpbox).find('span').css("border-left-color", "#fff");
                                $(meterialLumpbox).parent().parent().addClass("select-material");

                            }
                            else {
                                $(meterialLumpbox).css("-webkit-transform", "rotate(0deg)");
                                $(meterialLumpbox).data('status', '0');
                                $(meterialLumpbox).find('span').css("border-left-color", "#999");
                                $(meterialLumpbox).parent().parent().removeClass("select-material");
                            }
                        }

                    });
                });
            }
    }

    //获取制版信息
    TaskDetail.printBaseInfo = function () {
        //$(".platemakingBody").html(decodeURI(TaskDetail.platemaking));
        $(".platemakingBody table tr td:last-child").remove();
    }

    //接受任务、标记任务完成的弹出浮层
    TaskDetail.showConfirmForm = function (showStatus) {

        var alertMsg = showStatus == 0 ? "任务到期时间不可逆,确定设置?" : "标记完成的任务不可逆,确定设置?";
        confirm(alertMsg, function () {
            if (showStatus == 0) {
                TaskDetail.setTaskEndTime();
            }
            else {
                TaskDetail.finishTask();
            }
        });

    }
        
    //设置图片宽高
    TaskDetail.setImagesSize = function () {

        $(".main_image").css("height", $(window).width() + "px");
        $(".main_image li").css("height", $(window).width() + "px");
        $(".main_image li img").css("height", $(window).width() + "px");

    }

    module.exports = TaskDetail;

})