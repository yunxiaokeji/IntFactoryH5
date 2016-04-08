define(function (require, exports, module) {

    
    //引用滑屏控件JS
    //require("/modules/plug/touchSlider/js/jquery-1.js");
    //require("/modules/plug/touchSlider/js/jquery_002.js");
    //require("/modules/plug/touchSlider/js/jquery.js");

    var TaskDetail = {};

    TaskDetail.init = function () {

        TaskDetail.bindEvent();

    }

    TaskDetail.bindEvent = function () {

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

        $(".material .meterial-lump").click(function () {

            $(".material-main").slideToggle(500);
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

    }

    module.exports = TaskDetail;

})