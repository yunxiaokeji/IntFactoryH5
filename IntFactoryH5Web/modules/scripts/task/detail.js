define(function (require, exports, module) {
    var Global = require("global"),
        Upload = require("upload"),
        doT = require("dot"),
        OrderGoods = require("/modules/scripts/task/ordergoods");

    var Paras = {
        orderID: "",
        stageID: "",
        replayPageIndex: 1,
        logPageIndex: 1,
        endTime: "",
        taskID: ""
    };

    var AddReplyParas = {
        orderID: "",
        stageID: "",
        mark: "",
        content: "",
        fromReplyID: "",
        fromReplyUserID: "",
        fromReplyAgentID: ""
    };

    var Content = "";
    //判断是否发表评论中
    var IsLoading = false;
    //判断日志第一次加载
    var LogIsPageCount = true;
    var ReplyIsPageCount = true;
    var replyPageCount = 1;
    var logPageCount = 1;
    //默认绑定讨论下拉控件
    var bind = "talk-status";
    //默认获取讨论列表
    var GetOrAddReply = "GetReply";

    var TaskDetail = {};
    TaskDetail.init = function (haveImg, isOwner, userID, task) {
        var jsonTask = JSON.parse(task.replace(/&quot;/g, '"'));
        TaskDetail.task = jsonTask;
        TaskDetail.order = jsonTask.order;
        Paras.orderID = jsonTask.orderID;
        Paras.stageID = jsonTask.stageID;
        Paras.taskID = jsonTask.taskID;

        TaskDetail.haveImg = haveImg;
        TaskDetail.userID = userID;
        TaskDetail.isOwner = isOwner;

        AddReplyParas.orderID = jsonTask.orderID;
        AddReplyParas.stageID = jsonTask.stageID;
        AddReplyParas.mark = jsonTask.mark;

        OrderGoods.init(Global, doT);
        OrderGoods.orderid = jsonTask.orderID;
        OrderGoods.taskid = jsonTask.taskID;

        TaskDetail.bindEvent();
        TaskDetail.initStyle();
        //TaskDetail.getOrderList(TaskDetail.materialList);
        TaskDetail.bindTimerPicker();
        TaskDetail.setImagesSize();
    }

    //初始化样式信息
    TaskDetail.initStyle = function () {
        var documentWidth = $(window).width();
        var ducomentHeight = $(window).height();

        //设置图片显示宽高
        $(".pic-list li").css({ "margin-right": "10px", "border": "1px solid #ccc" });
        $(".pic-list .pic-box img").css({ "width": "100%", "height": "200px" });
        $(".platemakingBody table tr td:last-child").remove();
    }

    //绑定事件
    TaskDetail.bindEvent = function () {
        if (TaskDetail.haveImg == 1) {
            $dragBln = false;
            $(".main_image").touchSlider({
                flexible: true,
                speed: 200,
                paging: $(".flicking_con a"),
                counter: function (e) {
                    $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
                }
            });
        }

        var uploader = Upload.uploader({
            browse_button: 'reply-attachment',
            container: 'addition',
            drop_element: 'addition',
            file_path: "/Content/UploadFiles/Task/",
            picture_container: "pic-list",
            file_container: "doc-list",
            maxQuantity: 5,
            maxSize: 5,
            successItems: '.file li',
            image_view: "?imageView2/1/w/120/h/80",
            fileType: 3,
            init: {
                'FilesAdded': function (up, files) {
                    if ($("#pic-list").length == 0) {
                        $(".reply-layer-content").append('<div class="text-content" style="display:block;min-height:40px;"></div>');
                        $(".reply-layer-content").append('<ul class="pic-list task-file mTop20" id="pic-list" contenteditable="false"></ul><div class="clear"></div>');
                    }
                    if ($("#doc-list").length == 0) {
                        $(".reply-layer-content").append('<ul class="doc-list task-file mTop20 upload-file" id="doc-list" contenteditable="false"></ul><div class="clear"></div>');
                    }
                }
            }
        });

        //菜单切换模块事件
        $("nav ul li").click(function () {
            $(this).addClass("menuchecked").siblings().removeClass("menuchecked");
            $(this).parent().parent().find("i").css("color", "#9e9e9e");
            $(this).find("i").css("color", "#4a98e7");

            var classname = $(this).data("classname");
            bind = classname;
            $(".main-box ." + classname).show().siblings().hide();
            $(".main-box").css("margin-bottom", "0px");

            //讨论
            if (classname == "talk-status") {
                $(".main-box").css("margin-bottom", "80px");
                TaskDetail.getTaskReplys();
            }
                //材料
            else if (classname == "shop-status") {
                $(".main-box .loading-lump").hide();
            }
                //工艺说明
            else if (classname == "print-status") {
                TaskDetail.getPlateMakings();
            }
                //日志
            else if (classname == "log-status") {
                if (LogIsPageCount) {
                    TaskDetail.getTaskLogs();
                    LogIsPageCount = false;
                }
            }
                //手工成本
            else if (classname === "navCosts") {
                TaskDetail.getOrderCosts();
            }
                //打样发货
            else if (classname === "navSendDYDoc") {
                OrderGoods.getGetGoodsDoc(classname, 2);
            }
                //裁剪
            else if (classname == "navCutoutDoc") {
                OrderGoods.getGetGoodsDoc(classname, 1);
            }
                //车缝
            else if (classname == "navSewnDoc") {
                OrderGoods.getGetGoodsDoc(classname, 11);
            }
                //发货
            else if (classname == "navSendDoc") {
                OrderGoods.getGetGoodsDoc(classname, 22);
            }
        });

        $("nav ul li.menuchecked").click();

        //点击回到顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });

        //绑定完成任务
        if ($(".btn-finishTask").length > 0) {
            if ($('.btn-finishTask').val() == "标记完成") {
                if (TaskDetail.isOwner) {
                    $(".btn-finishTask").click(function () {
                        TaskDetail.showConfirmForm(1);
                    });
                }
            }
        }

        //关闭任务讨论浮层
        $(".cancel-reply").click(function () {
            $("body,html").removeClass('layer');
            $(".reply-layer").css("bottom", "-100%");
            setTimeout(function () { $(".reply-layer").hide(); }, 500);
        });

        //发表任务讨论
        $(".finish-reply").click(function () {
            GetOrAddReply = "AddReply";
            var _this = $(this);
            //讨论内容
            var newHtml = $('.reply-layer-content').clone();
            newHtml.find('.pic-list,.doc-list').remove();
            newHtml.find('div.clear').remove();
            if (!newHtml.text().trim()) {
                alert("讨论内容不能为空！");
                return false;
            }
            if ($('.task-file li').find('.mark-progress').length > 0) {
                alert("文件上传中，请稍等");
                return false;
            }

            _this.html('发表中...');
            if (IsLoading) {
                alert("发表中,请稍候再试.");
                return false;
            }

            var attachments = [];
            $('.task-file li').each(function () {
                var _this = $(this);
                attachments.push({
                    "ServerUrl": _this.data("server"),
                    "Type": _this.data('isimg'),
                    "FilePath": _this.data('filepath'),
                    "FileName": _this.data('filename'),
                    "OriginalName": _this.data('originalname'),
                    "Size": _this.data("filesize"),
                    "ThumbnailName": ""
                });
            });

            var divContent = "";
            if (newHtml.find('div').length > 0) {
                newHtml.find('div').each(function () {
                    var _this = $(this);

                    if (_this.index() != newHtml.find('div').length - 1) {
                        divContent += _this.text() + "<br/>";
                    } else {
                        /*如果是最后一个DIV则不换行*/
                        divContent += _this.text();
                    }
                });
                newHtml.find('div').remove();
                divContent = (newHtml.html().trim() != "" ? newHtml.html() + "<br/>" : "") + divContent;
            } else {
                divContent = newHtml.html();
            }
            AddReplyParas.content = divContent;
            var msgReply = JSON.stringify(AddReplyParas);

            IsLoading = true;
            $.post("/Task/AddTaskReply", {
                resultReply: msgReply,
                taskID: Paras.taskID,
                entityAttachments: JSON.stringify(attachments)
            }, function (data) {
                IsLoading = false;
                TaskDetail.GetOrAddTaskReply(data, GetOrAddReply);

                _this.html('发表');
                $('.reply-layer-content').html('');
                $("body,html").removeClass('layer');
                $(".reply-layer").css("bottom", "-100%");
                setTimeout(function () { $(".reply-layer").hide(); }, 500);
            });
        });

        //点击发表讨论出现弹出层
        $(".txt-talkcontent").click(function () {
            if (IsLoading) {
                alert("上一条评论发表中,请稍候再试.");
                return false;
            }
            $("body,html").addClass('layer');
            $(".reply-title").html('发表讨论');
            $(".reply-layer").show();
            setTimeout(function () { $(".reply-layer").css("bottom", "0") }, 10);
            setTimeout(function () { $(".reply-layer-content").focus(); }, 1000);
            if ($(".reply-layer-content .text-content").length == 0) {
                $(".reply-layer-content").prepend('<div class="text-content" style="display:block;min-height:40px;"></div>');
            }

            AddReplyParas.fromReplyID = '';
            AddReplyParas.fromReplyUserID = '';
            AddReplyParas.fromReplyAgentID = '';
        });

        //删除附件
        $(".reply-layer .del").click(function () {
            var _this = $(this);
            _this.parents('.file').remove();
        });

        /*显示表情浮层*/
        $(".qqface").click(function () {

        });

        TaskDetail.bindScroll();
    }

    //窗体加载绑定讨论下拉
    TaskDetail.bindScroll = function () {
        $(window).bind("scroll", function () {
            //滚动条超过图片显示致顶图标
            if ($(document).scrollTop() >= 60 + $(window).width()) {
                $(".getback").show();
            } else {
                $(".getback").hide();
            }

            if (bind == "talk-status" || bind == "log-status") {
                var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();

                if (bottom <= 20) {
                    //$("#tableLoad").attr("class", "");
                    setTimeout(function () {
                        if (bind == "talk-status") {
                            Paras.replayPageIndex++;
                            TaskDetail.getTaskReplys();
                        }
                        else if (bind == "log-status") {
                            Paras.logPageIndex++;
                            TaskDetail.getTaskLogs();
                        }
                    }, 1000);
                }
            }
        });
    }

    //绑定时间控件
    TaskDetail.bindTimerPicker = function () {
        if ($(".btn-acceptTaskTime").length == 0) { return; }
        if (!TaskDetail.isOwner) { return; }
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
    TaskDetail.setTaskEndTime = function () {

        $.post("/Task/UpdateTaskEndTime", Paras, function (data) {

            if (data == 1) {
                $(".end-time").html(Paras.endTime);
                $(".accept-time").html(new Date().toString("yyyy-MM-dd hh:mm:ss"));
                $(".task-accept").html("<input type='button' class='btn-finishTask' readonly='readonly' value='标记完成' />");
                $(".task-accept").find(".btn-finishTask").bind('click', function () {
                    TaskDetail.showConfirmForm(1);
                });
            } else if (data == 0) {
                alert("失败");
            } else if (data == 2) {
                alert("有前面阶段任务未完成");
            } else if (data == 3) {
                alert("没有权限");
            } else if (data == 4) {
                alert("任务没有接受，不能设置完成");
            } else if (data == 5) {
                alert("任务有未完成步骤");
            }
        });

    }

    //标记完成任务
    TaskDetail.finishTask = function () {
        $.post("/Task/FinishTask", Paras, function (data) {
            if (data == 1) {
                $(".task-accept").html("<span>已完成</span>");
                $(".complete-time").html(new Date().toString("yyyy-MM-dd hh:mm:ss"));
            } else if (data == 0) {
                alert("失败");
            } else if (data == 2) {
                alert("有前面阶段任务未完成");
            } else if (data == 3) {
                alert("没有权限;");
            } else if (data == 4) {
                alert("任务没有接受，不能设置完成");
            } else if (data == 5) {
                alert("任务有未完成步骤");
            }
        });
    }

    //接受任务、标记任务完成的弹出浮层
    TaskDetail.showConfirmForm = function (showStatus) {
        var alertMsg = showStatus == 0 ? "任务到期时间不可逆,确定设置?" : "标记完成的任务不可逆,确定设置?";
        confirm(alertMsg, function () {
            if (showStatus == 0) {
                TaskDetail.setTaskEndTime();
            } else {
                TaskDetail.finishTask();
            }
        });

    }

    //设置图片宽高
    TaskDetail.setImagesSize = function () {
        var windowWidth = $(window).width();
        $(".main_image").css({ "height": windowWidth + "px", "width": windowWidth + "px" });
        $(".main_image ul li").css({ "height": windowWidth + "px", "width": windowWidth + "px" });

        $(".main_image ul li").each(function () {
            if ($(this).find('img').width() > $(this).find('img').height()) {
                $(this).find('img').css("height", windowWidth + "px");
            } else {
                $(this).find('img').css("width", windowWidth + "px");
            }
        });
    }

    //获取任务讨论列表
    TaskDetail.getTaskReplys = function () {
        GetOrAddReply = "GetReply";
        if (replyPageCount >= Paras.replayPageIndex) {
            $(".main-box .loading-lump").show();
            $.post("/Task/GetDiscussInfo", Paras, function (data) {
                $(".main-box .loading-lump").hide();
                replyPageCount = data.pagecount;
                if (replyPageCount == 0) {
                    $(".noreply-msg").show();
                }
                else {
                    TaskDetail.GetOrAddTaskReply(data, GetOrAddReply);
                }
            });
        } else {
            if ($(".reply-box").length > 0) {
                if ($(".alert-lastreplypage").length == 0) {
                    $(".main-box .talk-main").append("<div class='alert-lastreplypage center mTop10 color999'>已经是最后一条啦</div>");
                }
            }
        }
    }

    //获取任务详情日志列表
    TaskDetail.getTaskLogs = function () {

        if (logPageCount >= Paras.logPageIndex) {
            $(".main-box .loading-lump").show();
            $.post("/Task/GetLogInfo", Paras, function (data) {
                $(".main-box .loading-lump").hide();
                logPageCount = data.pagecount;
                if (logPageCount == 0) {
                    $(".log-status").html("<div class='no-log'>暂无数据</div>");
                }
                else {
                    doT.exec("template/task/detailLog.html", function (templateFun) {

                        var items = data.items;

                        var innerText = templateFun(items);

                        $('.log-status').append(innerText);
                    });
                }
            })
        } else {
            $(".log-status .log-box").length == 0 ? "" : $(".alert-lastlogpage").length == 0 ? $(".main-box .log-status").append("<div class='alert-lastlogpage center mTop10 color999'>已经是最后一条啦</div>") : "";

        }
    }

    //获取材料采购计划列表
    TaskDetail.getOrderList = function (data) {
        if (data.length == 0) {
            $(".shop-status").html("<div class='no-material'>暂无材料</div>");
        } else {
            doT.exec("template/task/materList.html", function (templateFun) {
                var innerText = templateFun(data);
                innerText = $(innerText);
                $(".shop-status").html(innerText);
                //设置采购计划图标点击事件
                innerText.find(".material").click(function () {
                    var meterialLumpbox = $(this).find(".meterial-lumpbox");

                    if (!$(".material-main").is(":animated")) {
                        $(meterialLumpbox).parent().parent().siblings().slideToggle(500);
                        if ($(meterialLumpbox).data('status') == '0') {
                            $(meterialLumpbox).css({ "-webkit-transform": "rotate(90deg)", "transform": "rotate(90deg)" });
                            $(meterialLumpbox).data('status', '1');
                            $(meterialLumpbox).find('span').css("border-left-color", "#fff");
                            $(meterialLumpbox).parent().parent().addClass("select-material");

                        }
                        else {
                            $(meterialLumpbox).css({ "-webkit-transform": "rotate(0deg)", "transform": "rotate(0deg)" });
                            $(meterialLumpbox).data('status', '0');
                            $(meterialLumpbox).find('span').css("border-left-color", "#999");
                            $(meterialLumpbox).parent().parent().removeClass("select-material");
                        }
                    }

                });
            });
        }
    }

    //获取或添加任务讨论
    TaskDetail.GetOrAddTaskReply = function (data, replyOperate) {
        doT.exec("template/task/detail-reply.html", function (templateFun) {
            var innerText = templateFun(data.items);
            innerText = $(innerText);

            if (GetOrAddReply == "GetReply") {
                $(".talk-main").append(innerText);
                innerText.find(".reply-content").each(function () {
                    $(this).html(Global.replaceQqface($(this).html()));
                    $(this).find("img").css({ "width": "36px", "height": "36px" });
                });
            } else {
                if ($(".talk-main").find('div').length == 0) {
                    $(".noreply-msg").hide();
                }
                $(".talk-main").prepend(innerText);
            }

            //点击回复把用户名写入文本框
            innerText.find(".btn-reply").click(function () {
                if (IsLoading) {
                    alert("上一条评论发表中,请稍候再试.");
                    return false;
                }
                $("body,html").addClass('layer');
                $(".reply-layer").show();
                setTimeout(function () { $(".reply-layer").css("bottom", "0") }, 10);
                setTimeout(function () { $(".reply-layer-content").focus() }, 1000);

                AddReplyParas.fromReplyID = $(this).data("replyid");
                AddReplyParas.fromReplyUserID = $(this).data("userid");
                AddReplyParas.fromReplyAgentID = $(this).data("agentid");
                $(".reply-title").html('@' + $(this).data('name'));
            });
        });
    }

    //获取手工成本
    TaskDetail.getOrderCosts = function () {
        var _self = this;
        $("#navCosts .tr-header").nextAll().remove();
        $("#navCosts .tr-header").after("<tr><td colspan='10'><div class='data-loading' ><div></td></tr>");
        Global.post("/Orders/GetOrderCosts", {
            orderid: Paras.orderID
        }, function (data) {
            $("#navCosts .tr-header").nextAll().remove();
            data = JSON.parse(data);
            if (data.items.length > 0) {
                doT.exec("template/task/task-costs.html", function (template) {
                    var innerhtml = template(data.items);
                    innerhtml = $(innerhtml);

                    innerhtml.find(".cost-price").each(function () {
                        $(this).text($(this).text() * $("#navCosts").data("quantity"))
                    });
                    $("#navCosts .tr-header").after(innerhtml);
                });
            } else {
                $("#navCosts .tr-header").after("<tr><td colspan='10'><div class='nodata-txt' >暂无数据!</div></td></tr>");
            }
        });
    };

    //获取制版工艺说明
    TaskDetail.getPlateMakings = function () {
        var _self = this;
        $(".tb-plates .tr-header").nextAll().remove();
        $(".tb-plates .tr-header").after("<tr><td colspan='5'><div class='data-loading'><div></td></tr>");

        Global.post("/Orders/GetPlateMakings", {
            orderID: _self.order.orderType == 1 ? _self.order.orderID : _self.order.originalID
        }, function (data) {
            $(".tb-plates .tr-header").nextAll().remove();
            data = JSON.parse(data);
            if (data.items.length > 0) {
                doT.exec("template/orders/platematrings.html", function (template) {
                    PlateMakings = data.items;
                    var html = template(data.items);
                    html = $(html);
                    html.find(".dropdown").remove();
                    $(".tb-plates").append(html);
                });
            }
            else {
                $(".tb-plates").append("<tr><td colspan='5'><div class='nodata-txt'>暂无工艺说明<div></td></tr>");
            }
        });
    };

    module.exports = TaskDetail;
});
