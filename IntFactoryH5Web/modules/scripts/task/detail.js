define(function (require, exports, module) {

    var Paras = {
        orderID: "",
        stageID: "",
        platemaking: "",
        plateRemark: "",
        pageIndex: 1
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

    $PageCount = 0;

    

    TaskDetail.init = function (orderID, stageID, platemaking,mark) {
        Paras.orderID = orderID;
        Paras.stageID = stageID;
        Paras.platemaking = platemaking;


        AddReplyParas.orderID = orderID;
        AddReplyParas.stageID = stageID;
        AddReplyParas.mark = mark;

        TaskDetail.getTaskReplys();
        TaskDetail.bindEvent();
      
       

    }
   
    //绑定事件
    TaskDetail.bindEvent = function () {

        //窗体加载设置订单需求文本内容
        setOrderNeedWidth();

        //绑定滑屏控件事件
        $(document).ready(function () {
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
       });

        //绑定浏览器大小改变事件
        $(window).resize(function () {
            //浏览器大小改变设置讨论中,自己发送信息文本框的位置
            setTextPosition();
            //浏览器大小改变设置订单需求文本内容
            setOrderNeedWidth();

        })

        //菜单切换模块事件
        $("nav ul li").click(function () {

            $(this).addClass("menuchecked").siblings().removeClass("menuchecked");
            $(this).parent().parent().find("i").css("color", "#9e9e9e");
            $(this).find("i").css("color", "#4a98e7");

            var classname = $(this).data("classname");

            if (classname == "talk-status") {
                //初始化讨论页数
                $(".talk-main").html("");
                Paras.pageIndex = 1;
                TaskDetail.getTaskReplys();
                $(".main-box").css("margin-bottom", "60px");
            }

            else if (classname == "shop-status")
            {
                TaskDetail.getOrderList();
            }

            else if (classname == "log-status") {
                $('.log-status').find('.log-box').remove();
                TaskDetail.getTaskLogs();
                $(".main-box").css("margin-bottom", "0px");
            }

            else if (classname == "print-status") {
                TaskDetail.printBaseInfo();
            }

            $(".main-box ." + classname).show().siblings().hide();

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

                    $.post("/Task/AddTaskReply", { resultReply: msgReply }, function (data) {

                        doT.exec("/template/task/detailReply", function (templateFun) {

                            var innerText = templateFun(data);

                            $(".talk-main").prepend(innerText);

                        });

                })

            }

        })
     
        //设置采购计划图标点击事件
        $(".material").live("click", function () {
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

        })

        //点击回复把用户名写入文本框
        $(".talk-content .talk-main .iconfont").live("click", function () {

            AddReplyParas.fromReplyID = $(this).data("replyid");

            AddReplyParas.fromReplyUserID = $(this).data("userid");

            AddReplyParas.fromReplyAgentID = $(this).data("agentid");

            Content = "@" + $(this).data("name") + " ";

            $(".txt-talkcontent").val(Content);

            $(".txt-talkcontent").focus();

        })

        //浏览器滚动条在最下方时加载10条讨论信息
        $(window).bind("scroll", function () {

            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();

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

    //获取任务讨论列表
    TaskDetail.getTaskReplys = function () {

        $.post("/Task/GetDiscussInfo", Paras, function (data) {

            $PageCount = data.pagecount;
            var items = data.items;
            $pageNowCount = $(".talk-main").find('.send-self').length;
            for (var i = 0; i < items.length; i++) {

                if (items[i].createUser.userID != "bc6802e9-285c-471c-8172-3867c87803e2")
                {
                    $pageNowCount += 1;
                }

            }
             
            if ($PageCount != $pageNowCount) {
                doT.exec("/template/task/detailReply.html", function (templateFun) {

                    

                    var innerText = templateFun(items);

                    $(".talk-main").append(innerText);

                    //窗体加载设置自己发送信息文本框的位置
                    setTextPosition();

                });
            }

        })
    }
    
    //获取任务详情日志列表
    TaskDetail.getTaskLogs = function () {

        $.post("/Task/GetLogInfo", null, function (data) {
            
            doT.exec("/template/task/detailLog.html", function (templateFun) {

                var items = data.items;

                var innerText = templateFun(items);

                $('.log-status').html(innerText);

            });

        })

    }

    //获取材料采购计划列表
    TaskDetail.getOrderList = function () {

        $.post("Task/GetOrderInfo",Paras, function (data) {

            doT.exec("/template/task/materList.html", function (templateFun) {

                var innerText = templateFun(data.items);

                $(".shop-status").html(innerText);

            });

        })

    }

    //获取制版信息
    TaskDetail.printBaseInfo = function () {

        $(".platemakingBody").html(decodeURI(Paras.platemaking));
        $(".platemakingBody table tr td:last-child").remove();

    }



    module.exports = TaskDetail;

})