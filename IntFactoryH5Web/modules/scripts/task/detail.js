define(function (require, exports, module) {

    var Paras = {
        orderID: "",
        stageID: "",
        platemaking: "",
        plateRemark: "",
        pageIndex: 1
    };

    var TaskDetail = {};

    TaskDetail.init = function (orderID, stageID, platemaking, plateRemark) {

        Paras.orderID = orderID;
        Paras.stageID = stageID;
        Paras.platemaking = platemaking;
        TaskDetail.getTaskReplys();
        TaskDetail.bindEvent();
      
       

    }
    //设置自己发送信息文本框的位置
   
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

        //设置采购计划图标点击事件
        $(".material .meterial-lumpbox").click(function () {

            if (!$(".material-main").is(":animated")) {
                $(this).parent().parent().siblings().slideToggle(500);
                if ($(this).data('status') == '0') {
                    $(this).css("transform", "rotate(90deg)");
                    $(this).data('status', '1');
                    $(this).find('span').css("border-left-color", "#999");
                    $(this).parent().parent().addClass("select-material");

                }
                else {
                    $(this).css("transform", "rotate(0deg)");
                    $(this).data('status', '0');
                    $(this).find('span').css("border-left-color", "#fff");
                    $(this).parent().parent().removeClass("select-material");
                }
            }
            //var status=$(this).data("status");

            //if (status == 0) {
            //    $(".material-main").slideDown(500);
            //    $(this).data("status", "1");
            //}
            //else {
            //    $(this).data("status", "0");
            //    $(".material-main").slideUp(500);
            //}

        })

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
            alert(data.items);
            doT.exec("/template/task/detailReply.html", function (templateFun) {

                var items = data.items;

                var innerText = templateFun(items);

                $(".talk-main").html(innerText);

                //窗体加载设置自己发送信息文本框的位置
                setTextPosition();
                
            });

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

           

        })

    }

    //获取制版信息
    TaskDetail.printBaseInfo = function () {

        alert(Paras.platemaking);
        alert(paras.plateRemark);

    }

    module.exports = TaskDetail;

})