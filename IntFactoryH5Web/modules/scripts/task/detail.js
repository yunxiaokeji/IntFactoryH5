﻿define(function (require, exports, module) {

    
    //引用滑屏控件JS
    //require("/modules/plug/touchSlider/js/jquery-1.js");
    //require("/modules/plug/touchSlider/js/jquery_002.js");
    //require("/modules/plug/touchSlider/js/jquery.js");

    var TaskDetail = {};

    TaskDetail.init = function () {

        TaskDetail.bindEvent();

    }
    //设置自己发送信息文本框的位置
   
    TaskDetail.bindEvent = function () {
        
        //窗体加载设置自己发送信息文本框的位置
        setTextPosition();
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

                $(".main-box").css("margin-bottom", "80px");
            }
            else {
                $(".main-box").css("margin-bottom", "0px");
            }
            $(".main-box ." + classname).show().siblings().hide();

            setTextPosition();

            //$(".main-box").data("status", $(this).index());
            //var showModuleStatus = $(".main-box").data("status");

            //if (showModuleStatus == '0')
            //{

            //    $(".main-box .talk-status").show().siblings().hide();
            //    $(".main-box").css("margin-bottom","80px");
            //}
            //else if (showModuleStatus == '1')
            //{

            //    $(".main-box .shop-status").show().siblings().hide();
            //    $(".main-box").css("margin-bottom", "0px");
            //}

        })

        //文本框获取焦点
        //$('.txt-talkcontent').bind('focus', function () {
        //    $('.return-msg').css({ 'position': 'static', 'bottom': '0' });
        //    $('.main-box').css({ "margin-bottom": '0' ,"padding-bottom":"0px"});
        //    //或者$('#viewport').height($(window).height()+'px');  
        //}).bind('blur', function () {
        //    $('.return-msg').css({ 'position': 'fixed', 'bottom': '0' });
        //    $('.main-box').css({ "margin-bottom": '80px', "padding-bottom": "0px" });
        //    //或者$('#viewport').height('auto');  
        //});

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

        //设置自己发送信息文本框的位置
        function setTextPosition() {
            //获取显示区域宽度
            var showWidth = $(this).width() - 40;
            //获取显示文本宽度
            var showTextWidth = $(".send-self .talk-self").width();
            //设置自己发送信息文本框的位置
            $(".send-self .talk-self").css("margin-left", showWidth - showTextWidth - 70 + "px");
        }

    

    }

  

    //TaskDetail.setTextPosition = function () {

    //    //获取显示区域宽度
    //    var showWidth = $(this).width() - 40;
    //    //获取显示文本宽度
    //    var showTextWidth = $(".send-self .talk-self").width();
    //    //设置自己发送信息文本框的位置
    //    $(".send-self .talk-self").css("margin-left", showWidth - showTextWidth - 60 + "px");

    //}

    module.exports = TaskDetail;

})