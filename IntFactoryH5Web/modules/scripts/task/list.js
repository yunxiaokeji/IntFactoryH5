define(function (require,exports,module) {
    var Global = require("global"),
        doT = require("dot");

    var Params = {
        keyWords: "",
        isMy: true,
        userID: "",
        taskType: -1,
        colorMark: -1,
        status: 1,
        finishStatus: 0,
        beginDate: "",
        endDate: "",
        orderType: -1,
        orderProcessID: "-1",
        orderStageID: "-1",
        taskOrderColumn: 0,
        isAsc: 0,
        pageSize: 5,
        pageIndex: 1,
        isParticipate: false,
    };
    var ObjectJS = {};
    ObjectJS.PageCount = 0;
    ObjectJS.IsLoading = false;
    ObjectJS.init = function () {
        ObjectJS.bindEvent();
        ObjectJS.getList();
        ObjectJS.getTaskLableColors();
    };

    ObjectJS.bindEvent = function () {
        //滚动加载数据
        $(window).scroll(function () {
            if (document.body.scrollTop > 30) {
                $(".getback").slideDown("slow");
            } else {
                $(".getback").slideUp("slow");
            }
            var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();
            if (bottom <= 200) {
                if (!ObjectJS.IsLoading) {
                    Params.pageIndex++;
                    if (Params.pageIndex <= ObjectJS.PageCount) {
                        ObjectJS.getList(true);
                    } else {
                        $(".prompt").remove();
                        $(".list").append('<div class="prompt">已经是最后一条啦</div>');
                    }
                }
            }
        });

        //页面点击
        $(document).click(function (e) {
            if (!$(e.target).parents().hasClass("btn-menu") && !$(e.target).hasClass("btn-menu")) {
                $(".menu-box").slideUp(400);
            }
            if (!$(e.target).parents().hasClass("filter-task") && !$(e.target).hasClass("filter-task")) {
                $(".dropdownlist .potion").slideUp(400);
            }
            if (!$(e.target).parents().hasClass("btn-task-filtertype") && !$(e.target).hasClass("btn-task-filtertype")) {
                $(".task-filtertype").slideUp(400);
            }
        });

        //显示关键字遮罩层
        $(".iconfont-search").click(function () {
            $(".btn-search").text("确定");
            $(".txt-search").val("").focus();
            $(".shade,.search").show();
            $(".span-search").css("width", (document.body.clientWidth - 150) + "px");
        });

        //关键字查询
        $(".btn-search").click(function () {
            Params.pageIndex = 1;

            var name = $(this).text();
            if (name == "确定") {
                var txt = $(".txt-search").val();
                if (txt != "") {
                    $(".shade").slideUp("slow");
                    $(this).text("取消");

                    Params.keyWords = txt;
                    ObjectJS.getList();
                    
                } else {
                    $(".search").hide();
                }
            } else {
                $(".search").hide();

                Params.keyWords = "";
                ObjectJS.getList();
            }
            $(".shade").hide();
        });

        //搜索内容发生变化
        $(".txt-search").keyup(function () {
            var changeAfter = $(".txt-search").val();
            if (changeAfter == "") {
                $(".cencal").text("取消");
            } else if (Params.keyWords == changeAfter) {
                $(".cencal").text("取消");
            } else {
                $(".cencal").text("确定");
            }
        });

        //点击遮罩层空白区域
        $(".shade").click(function () {
            $(".shade").hide();
            $(".search").hide();
        });

        //显示主菜单
        $(".btn-menu").click(function () {
            $(".menu-box").slideToggle(400);
        });

        //显示任务过滤类型
        $(".btn-task-filtertype").click(function () {
            $(".task-filtertype").slideToggle(400);
        });

        //任务过滤类型切换
        $(".task-filtertype li").click(function () {
            $(".task span").text($(this).text());
            $(this).parent().hide();

            var filtertype = $(this).data("filtertype");
            if (filtertype == 0) {
                Params.isParticipate = false;
            } else {
                Params.isParticipate = true;
            }
            ObjectJS.getList();
        });

        //任务状态切换
        $(".task-status li").click(function () {
            $(this).siblings().find(".iconfont,a").css("color", "#777");
            $(this).find(".iconfont,a").css("color", "#4a98e7");

            Params.pageIndex = 1;
            Params.finishStatus = $(this).data("status");
            ObjectJS.getList();
        });

        //显示过滤下拉框
        $(".filter-task li").click(function () {
            Params.pageIndex = 1;

            var $slideUl = $("." + $(this).data("id"));
            $slideUl.slideToggle(400).siblings().slideUp("slow");
        });

        //订单类型切换
        $(".order-type li").click(function () {
            $(".type-span").text($(this).text());
            $(this).parent().hide();

            Params.pageIndex = 1;
            Params.orderType = $(this).data("id");
            ObjectJS.getList();
        });

        //任务排序
        $(".task-sort li").click(function () {
            $(".sort-span").text($(this).text());
            $(this).parent().hide();
            
            Params.isAsc = $(this).data("takepo");
            Params.taskOrderColumn = $(this).data("id");
            ObjectJS.getList();
        });

        //返回顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });
    };

    ObjectJS.getList = function (noEmpty) {
        ObjectJS.IsLoading = true;
        if (!noEmpty) {
            $(".list").empty();
        }
        //获取任务列表(页面加载)
        $(".list").append('<div class="listbg mTop20"></div>');
        $.post("/Task/GetTask", { filter: JSON.stringify(Params) }, function (data) {
            //获取用户名
            $(".login-name").text(data.userName);
            //判断有无数据
            if (data.items.length == 0) {
                $(".list").append("<div class='nodata'>暂无数据 !</div>");
            } else {
                //分页数据
                ObjectJS.PageCount = data.pageCount;
                //引用doT模板
                doT.exec("template/task/task-list.html", function (code) {
                    var $result = code(data.items);
                    $(".list").append($result);
                });
                ObjectJS.IsLoading = false;
            }
            $(".listbg").remove();
        });
    };

    ObjectJS.getTaskLableColors=function(){
        $.post("/Task/GetTaskLableColors", null, function (data) {
            data = JSON.parse(data);
            var items = data.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var html = '';
                html += '<li data-id="' + item.ColorID + '"><span class="lable-color" style="background-color:' + item.ColorValue + '"></span><span>' + item.ColorName + '</span></li>';

                $(".task-colormark").append(html);
            }
            //任务颜色标记切换
            $(".task-colormark li").click(function () {
                $(".colormark-span").text($(this).text());
                $(this).parent().hide();

                Params.pageIndex = 1;
                Params.colorMark = $(this).data("id");
                ObjectJS.getList();
            });
            
        });
    };

    module.exports = ObjectJS;
});