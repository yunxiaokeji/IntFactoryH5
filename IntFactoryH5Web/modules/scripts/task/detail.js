define(function (require, exports, module) {

    var Global = require("global");

    var Paras = {
        orderID: "",
        stageID: "",     
        pageIndex: 1,
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



    //第一次加载判断讨论总页数
    var IsPageCount = true;

    $PageCount = 1000000;

    TaskDetail.init = function (orderID, stageID, platemaking, mark, plateremark,taskID,imgStatus,userID) {

        Paras.orderID = orderID;
        Paras.stageID = stageID;
        TaskDetail.platemaking = platemaking;
        TaskDetail.plateremark = plateremark;
        TaskDetail.imgStatus = imgStatus;
        TaskDetail.userID = userID;

        //加载图标状态
        TaskDetail.loadingStatus = true;

        Paras.taskID = taskID;
        AddReplyParas.orderID = orderID;
        AddReplyParas.stageID = stageID;
        AddReplyParas.mark = mark;
        TaskDetail.bindEvent();

    }
   
    //绑定事件
    TaskDetail.bindEvent = function () {

        //浏览器加载获取讨论列表
        TaskDetail.getTaskReplys();

        //浏览器加载获取材料信息
        TaskDetail.getOrderList();

        //调用绑定选择时间控件
        TaskDetail.bindTimerPicker();

        //浏览器加载设置订单需求文本内容
        setOrderNeedWidth();

        //返回按钮history.back();
        //$(".btn-return").click(function () {
        //    //href = "javascript:if(history.length>1){ history.go(-1);} else{}"
        //    //location.href = history.back();

        
        //绑定滑屏控件事件
        $(document).ready(function () {
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
        });

        //绑定浏览器大小改变事件
        $(window).resize(function () {
            //浏览器大小改变设置讨论中,自己发送信息文本框的位置
            setTextPosition();
            //浏览器大小改变设置订单需求文本内容
            setOrderNeedWidth();
            //浏览器大小改变设置接受任务、标记任务完成按钮弹出层位置
            setAcceptTaskPosition();
        })

        //菜单切换模块事件
        $("nav ul li").click(function () {
            
            $(this).addClass("menuchecked").siblings().removeClass("menuchecked");
            $(this).parent().parent().find("i").css("color", "#9e9e9e");
            $(this).find("i").css("color", "#4a98e7");
            var classname = $(this).data("classname");
            $(".main-box ." + classname).show().siblings().hide();
            $(".main-box .loading-lump").show();
            //点击讨论模块
            if (classname == "talk-status") {
                //初始化讨论页数
                $(".talk-main").html("");
                IsPageCount = true;
                TaskDetail.loadingStatus = true;
                $PageCount = 100000;
                Paras.pageIndex = 1;
                TaskDetail.getTaskReplys();
                $(".main-box").css("margin-bottom", "60px");
                //浏览器滚动条在最下方时加载10条讨论信息
                $(window).unbind("scroll");
                $(window).bind("scroll", function () {

                    var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();
                    if (TaskDetail.loadingStatus) {
                        $(".main-box .loading-lump").show().css("margin-bottom", "10px");
                    }
                    if (bottom <= 0) {
                        //$("#tableLoad").attr("class", "");
                        setTimeout(function () {
                            Paras.pageIndex++;
                            TaskDetail.getTaskReplys();
                        }, 1000);
                    }
                });
            }

            //点击材料计划模块
            else if (classname == "shop-status")
            {
                $(".main-box .loading-lump").hide();
                $(window).unbind("scroll");
            }

            //点击日志模块
            else if (classname == "log-status") {
                IsPageCount = true;
                Paras.pageIndex = 1;
                $PageCount = 100000;
                $('.log-status').find('.log-box').remove();
                TaskDetail.getTaskLogs();
                $(".main-box").css("margin-bottom", "0px");
                $(window).unbind("scroll");
                $(window).bind("scroll", function () {
                    var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();
                    if (bottom <= 0) {
                        //$("#tableLoad").attr("class", "");
                        setTimeout(function () {
                            Paras.pageIndex++;
                            TaskDetail.getTaskLogs();
                        }, 1000);
                    }

                });
            }

            //点击制版模块
            else if (classname == "print-status") {
                $(window).unbind("scroll");
                TaskDetail.printBaseInfo();
                $(".main-box .loading-lump").hide();
            }

            setTextPosition();

        })

        //点击提交按钮
        $(".btn-submit").bind("click",function () {

            AddReplyParas.content = $(".txt-talkcontent").val().replace(Content, "");

            if ($(".txt-talkcontent").val().indexOf(Content) != 0) {

                AddReplyParas.fromReplyID = "";

                AddReplyParas.fromReplyUserID = "";

                AddReplyParas.fromReplyAgentID = "";

            }
          
            
            if (AddReplyParas.content != "") {

                var msgReply = JSON.stringify(AddReplyParas);
                $(this).val("提交中...");
                $(this).attr("disabled", "disabled");
                    $.post("/Task/AddTaskReply", { resultReply: msgReply }, function (data) {
                       
                        doT.exec("/template/task/detailReply.html", function (templateFun) {

                            var dataReplys = {};
                            dataReplys.items = data.items;
                            dataReplys.userID = TaskDetail.userID;
                            var innerText = templateFun(dataReplys);

                            if ($(".talk-main").find('div').length == 0) {
                                $(".noreply-msg").hide();
                            }
                            $(".talk-main").prepend(innerText);

                            //窗体加载设置自己发送信息文本框的位置
                            setTextPosition();

                            $(".btn-submit").val("提交");
                            $(".btn-submit").attr("disabled", false);
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

            }

        })
     
        //绑定完成任务
        $(".task-accept").click(function () {

            if ($(this).find("span").text() == "标记完成") {

                TaskDetail.showConfirmForm(1);
               
            }

        });

        //窗体加载绑定讨论下拉
        $(window).bind("scroll", function () {

            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();
            if (TaskDetail.loadingStatus) {
                $(".main-box .loading-lump").show().css("margin-bottom", "10px");
            }
            if (bottom <= 0) {
                //$("#tableLoad").attr("class", "");
                setTimeout(function () {
                    Paras.pageIndex++;
                    TaskDetail.getTaskReplys();
                }, 1000);
            }

        });

        //设置订单需求文本内容宽度
        function setOrderNeedWidth() {
            //订单需求第一个SPAN宽度
            var orderNeedOne = $(".order-need span:first-child").width();
            //订单需求第二个SPAN宽度
            var orderNeedTwo = $(".order-need span:nth-child(2)").width();
            //设置订单需求第三个SPAN宽度
            var orderNeedThree = $(window).width() - orderNeedOne - orderNeedTwo - 20 - 6 - 10;

            $(".order-need span:last-child").css("width", orderNeedThree + "px");
        }

    }
    
    //设置自己发送信息文本框的位置
    function setTextPosition() {
        //获取显示区域宽度
        var showWidth = $(this).width() - 40;
        //获取显示文本宽度
        var showTextWidth = $(".send-self .talk-self").width();
        //设置自己发送信息文本框的位置
        $(".send-self .talk-self").css("margin-left", showWidth - showTextWidth - 70 + "px");
    }

    //设置接受任务、标记任务完成按钮弹出层位置
    function setAcceptTaskPosition() {

        $(".alert").css("left", ($(window).width() - 250) / 2 + "px");

    }

    //绑定时间控件
    TaskDetail.bindTimerPicker = function () {
        var defaultParas = {
            preset: 'datetime',
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            lang: 'zh',
            onSelect: function () {

                Paras.endTime =  $(".appDateTime").val();

                TaskDetail.showConfirmForm(0);

                $(".appDateTime").val("接受任务");

            }
        };
        $(".appDateTime").mobiscroll().datetime(defaultParas);
    }

    //设置任务到期时间
    TaskDetail.setTaskEndTime =function() {

        var d = new Date();
        var vYear = d.getFullYear();
        var vMon = d.getMonth() + 1;
        var vDay = d.getDate();
        var h = d.getHours();
        var m = d.getMinutes();
        //获取本地时间
        var LocalTime = vYear + "-" + (vMon < 10 ? "0" + vMon : vMon) + "-" + (vDay < 10 ? "0" + vDay : vDay) + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

        $.post("/Task/UpdateTaskEndTime", Paras, function (data) {
            
            if (data == 1) {
                $(".end-time").html(Paras.endTime);
                $(".accept-time").html(LocalTime);
                $(".task-accept").html("<span>标记完成</span>");
                $(".task-accept").find("span").click(function () {
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
        var d = new Date()
        var vYear = d.getFullYear()
        var vMon = d.getMonth() + 1
        var vDay = d.getDate()
        var h = d.getHours();
        var m = d.getMinutes();
        //获取本地时间
        var LocalTime = vYear + "-" + (vMon < 10 ? "0" + vMon : vMon) + "-" + (vDay < 10 ? "0" + vDay : vDay) + " " + (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

        $.post("/Task/FinishTask", Paras, function (data) {
            if (data == 1) {
                $(".task-accept").html("<span>已完成</span>");
                $(".task-accept").unbind('click');
                $(".complete-time").html(LocalTime);
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
        
        if ($PageCount >= Paras.pageIndex) {
           
            $.post("/Task/GetDiscussInfo", Paras, function (data) {
                $totalCount = data.totalcount;
            if (IsPageCount) {
                $PageCount = data.pagecount;
            }
            if ($PageCount == 0) {
                $(".noreply-msg").show();
                $(".main-box .loading-lump").hide();
            }
            else {
                if ($PageCount >= Paras.pageIndex) {

                    doT.exec("/template/task/detailReply.html", function (templateFun) {
                        var dataReplys = {};
                        dataReplys.items = data.items;
                        dataReplys.userID = TaskDetail.userID;
                        var innerText = templateFun(dataReplys);
                        //var innerText = templateFun(items);
                        innerText = $(innerText);

                        $(".talk-main").append(innerText);

                        $(".main-box .loading-lump").hide();

                        //窗体加载设置自己发送信息文本框的位置
                        setTextPosition();

                        innerText.find(".text-talk").each(function () {
                            $(this).html(TaskDetail.replaceQqface($(this).html()));
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

                    });
                }
                    else {
                        $(".main-box .loading-lump").hide();
                    }
            }
                IsPageCount = false;
            })
        }
        else {
            TaskDetail.loadingStatus = false;
            $(".main-box .loading-lump").hide();
        }
    }
    
    //获取任务详情日志列表
    TaskDetail.getTaskLogs = function () {
    
        $(".main-box .loading-lump").show();
        if ($PageCount >= Paras.pageIndex) {
            $.post("/Task/GetLogInfo", Paras, function (data) {
                if (IsPageCount) {
                    $PageCount = data.pagecount;
                }
                if ($PageCount == 0) {
                    $(".log-status").html("<div class='no-log'>暂无数据</div>");

                }
                else {
                    if ($PageCount >= Paras.pageIndex) {
                        doT.exec("/template/task/detailLog.html", function (templateFun) {

                            var items = data.items;

                            var innerText = templateFun(items);

                            $('.log-status').append(innerText);

                        });
                    }
                }
                $(".main-box .loading-lump").hide();
                IsPageCount = false;
            })
        }
        else {
            $(".main-box .loading-lump").hide();
        }

    }

    //获取材料采购计划列表
    TaskDetail.getOrderList = function () {
        $(".main-box .loading-lump").show();
        $.post("/Task/GetOrderInfo", Paras, function (data) {
            if (data.items.length == 0) {
                $(".shop-status").html("<div class='no-material'>暂无材料！</div>");
            }
            else {
                doT.exec("/template/task/materList.html", function (templateFun) {

                    var innerText = templateFun(data.items);
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
            $(".main-box .loading-lump").hide();
        })

    }

    //获取制版信息
    TaskDetail.printBaseInfo = function () {
        $(".main-box .loading-lump").show();
        $(".platemakingBody").html(decodeURI(TaskDetail.platemaking));
        $(".platemakingBody table tr td:last-child").remove();
        $(".plate-remark").html(decodeURI(TaskDetail.plateremark));
        $(".main-box .loading-lump").hide();
    }

    //设置接受任务、标记任务完成按钮弹出层位置
    TaskDetail.showConfirmForm = function (showStatus) {
        var alertMsg = "";
        doT.exec("/template/task/alertPage.html", function (templateFun) {

            if (showStatus == 0) {
                alertMsg = "任务到期时间不可逆,确定设置?";
            }
            else {
                alertMsg = "标记完成的任务不可逆,确定设置?";
            }
            var innerText = templateFun(alertMsg);

            innerText = $(innerText);

            $("body").append(innerText);
            //加载完毕设置位置剧中
            setAcceptTaskPosition();

            //点击提示框外关闭提示框
            $(".alert-layer").bind("click", function () {

                $(this).hide();

                $(".alert").hide();

            })
            $(".confirm").click(function () {

                if (showStatus == 0) {
                    TaskDetail.setTaskEndTime();
                }
                else {
                    TaskDetail.finishTask();
                }

                $(".alert").hide();

                $(".alert-layer").hide();
            })

            $(".cancel").click(function () {

                $(".alert").hide();

                $(".alert-layer").hide();

            })
        })

    }

    TaskDetail.replaceQqface = function (str) {
        str = str.replace(/\</g, '&lt;');
        str = str.replace(/\>/g, '&gt;');
        str = str.replace(/\n/g, '<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g, '<img style="width:24px;height:24px;" align="absbottom" src="/modules/images/qqface/$1.gif" border="0" />');
        return str;
    }

    module.exports = TaskDetail;

})