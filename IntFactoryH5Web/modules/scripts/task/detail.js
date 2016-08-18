define(function (require, exports, module) {
    var Global = require("global"),
        Upload = require("upload"),
        doT = require("dot"),
        OrderGoods = require("/modules/scripts/task/ordergoods");

    var Paras = {
        orderID: "",
        taskID: "",
        replyPageIndex: 1,
        logPageIndex: 1,
        endTime: ""
    };

    var TaskReplyParas = {
        taskID: "",
        content: "",
        fromReplyID: "",
        fromReplyUserID: "",
        fromReplyAgentID: ""
    };

    var IsLoading = false;
    var replyPageCount = 1;
    var logPageCount = 1;
    var ModuleType = "talk-status";
    var GetOrAddReply = "GetReply";
    var WindowScrollTop = 0;

    var ObjectJS = {};
    ObjectJS.init = function (haveImg, isOwner, userID, task) {
        var jsonTask = JSON.parse(task.replace(/&quot;/g, '"'));
        Paras.orderID = jsonTask.orderID;
        Paras.taskID = jsonTask.taskID;

        ObjectJS.task = jsonTask;
        ObjectJS.order = jsonTask.order;
        ObjectJS.haveImg = haveImg;
        ObjectJS.userID = userID;
        ObjectJS.isOwner = isOwner;

        TaskReplyParas.taskID = jsonTask.taskID;

        OrderGoods.init(Global, doT);
        OrderGoods.orderid = jsonTask.orderID;
        OrderGoods.taskid = jsonTask.taskID;

        ObjectJS.bindTimerPicker();
        ObjectJS.bindEvent();
        ObjectJS.setImagesSize();
    }

    //绑定事件
    ObjectJS.bindEvent = function () {
        if (ObjectJS.haveImg == 1) {
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
            }
        });

        //菜单切换模块事件
        $("nav ul li").click(function () {
            var _self = $(this);
            _self.addClass("menuchecked").siblings().removeClass("menuchecked");
            _self.parent().parent().find("i").css("color", "#9e9e9e");
            _self.find("i").css("color", "#4a98e7");
            var classname = _self.data("classname");
            ModuleType = classname;
            $(".main-box ." + classname).show().siblings().hide();
            $(".main-box .loading-lump").hide();
            var isGet = _self.data("isget");
            //讨论
            if (classname == "talk-status") {
                if (!isGet) {
                    ObjectJS.getTaskReplys();
                    _self.data("isget","1");
                }
            }
                //材料
            else if (classname == "shop-status") {
                if (!isGet) {
                    ObjectJS.GetOrderDetailsByOrderID();
                    _self.data("isget", "1");
                }
            }
                //工艺说明
            else if (classname == "print-status") {
                if (!isGet) {
                    ObjectJS.getPlateMakings();
                    _self.data("isget", "1");
                }
            }
                //日志
            else if (classname == "log-status") {
                if (!isGet) {
                    ObjectJS.getTaskLogs();
                    _self.data("isget", "1");
                }
                    
            }
                //手工成本
            else if (classname === "navCosts") {
                if (!isGet) {
                    ObjectJS.getOrderCosts();
                    _self.data("isget", "1");
                }
            }
                //打样发货
            else if (classname === "navSendDYDoc") {
                if (!isGet) {
                    ObjectJS.getTaskReplys();
                    OrderGoods.getGetGoodsDoc(classname, 2);
                }
            }
                //裁剪
            else if (classname == "navCutoutDoc") {
                if (!isGet) {
                    ObjectJS.getTaskReplys();
                    OrderGoods.getGetGoodsDoc(classname, 1);
                }
            }
                //车缝
            else if (classname == "navSewnDoc") {
                if (!isGet) {
                    OrderGoods.getGetGoodsDoc(classname, 11);
                    _self.data("isget", "1");
                }
            }
                //发货
            else if (classname == "navSendDoc") {
                if (!isGet) {
                    OrderGoods.getGetGoodsDoc(classname, 22);
                    _self.data("isget", "1");
                }
            }
        });

        //点击回到顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });

        //绑定完成任务
        if ($(".btn-finishTask").length > 0) {
            if ($('.btn-finishTask').val() == "标记完成") {
                if (ObjectJS.isOwner) {
                    $(".btn-finishTask").click(function () {
                        ObjectJS.showConfirmForm(1);
                    });
                }
            }
        }

        //关闭任务讨论浮层
        $(".cancel-reply").click(function () {
            $("body,html").removeClass('layer');
            $(".reply-layer").css("bottom", "-100%");
            setTimeout(function () {
                $(".reply-layer").hide();
                
                $('body,html').animate({ scrollTop: WindowScrollTop }, 100);
            }, 500);
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
            TaskReplyParas.content = divContent;
            var msgReply = JSON.stringify(TaskReplyParas);

            IsLoading = true;
            $.post("/Task/AddTaskReply", {
                resultReply: msgReply,
                entityAttachments: JSON.stringify(attachments)
            }, function (data) {
                IsLoading = false;
                ObjectJS.GetOrAddTaskReply(data, GetOrAddReply);

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
            if ($("#pic-list").length == 0) {
                $(".reply-layer-content").append('<div class="text-content" style="display:block;min-height:40px;"></div>');
                $(".reply-layer-content").append('<ul class="pic-list task-file mTop20" id="pic-list" contenteditable="false"></ul><div class="clear"></div>');
            }
            if ($("#doc-list").length == 0) {
                $(".reply-layer-content").append('<ul class="doc-list task-file mTop20 upload-file" id="doc-list" contenteditable="false"></ul><div class="clear"></div>');
            }

            WindowScrollTop = $(document).scrollTop();
            $("body,html").addClass('layer');
            $(".reply-title").html('发表讨论');
            $(".reply-layer").show();
            setTimeout(function () { $(".reply-layer").css("bottom", "0") }, 10);
            setTimeout(function () { $(".reply-layer-content").focus(); }, 1000);
            if ($(".reply-layer-content .text-content").length == 0) {
                $(".reply-layer-content").prepend('<div class="text-content" style="display:block;min-height:40px;"></div>');
            }

            TaskReplyParas.fromReplyID = '';
            TaskReplyParas.fromReplyUserID = '';
            TaskReplyParas.fromReplyAgentID = '';
        });

        //删除附件
        $(".reply-layer .del").click(function () {
            var _this = $(this);
            _this.parents('.file').remove();
        });

        /*显示表情浮层*/
        $(".qqface").click(function () {

        });

        ObjectJS.bindScroll();

        $("nav ul li.menuchecked").click();
    }

    //窗体加载绑定讨论下拉
    ObjectJS.bindScroll = function () {
        $(window).bind("scroll", function () {
            //滚动条超过图片显示致顶图标
            if ($(document).scrollTop() >= 60 + $(window).width()) {
                $(".getback").show();
            } else {
                $(".getback").hide();
            }

            if (ModuleType == "talk-status" || ModuleType == "log-status") {
                var bottom = $(document).height() - document.documentElement.scrollTop - document.body.scrollTop - $(window).height();
                if (bottom <= 20) {
                    setTimeout(function () {
                        if (ModuleType == "talk-status") {
                            Paras.replyPageIndex++;
                            ObjectJS.getTaskReplys();
                        }
                        else if (ModuleType == "log-status") {
                            Paras.logPageIndex++;
                            ObjectJS.getTaskLogs();
                        }
                    }, 1000);
                }
            }
        });
    }

    //绑定时间控件
    ObjectJS.bindTimerPicker = function () {
        if ($(".btn-acceptTaskTime").length == 0) { return; }
        if (!ObjectJS.isOwner) { return; }
        var defaultParas = {
            preset: 'datetime',
            theme: 'android-ics light', //皮肤样式
            display: 'modal', //显示方式 
            mode: 'scroller', //日期选择模式
            lang: 'zh',
            onSelect: function () {
                Paras.endTime = $(".btn-acceptTaskTime").val();
                ObjectJS.showConfirmForm(0);
                $(".btn-acceptTaskTime").val("接受任务");
            }
        };
        $(".btn-acceptTaskTime").mobiscroll().datetime(defaultParas);
    }

    //设置任务到期时间
    ObjectJS.setTaskEndTime = function () {

        $.post("/Task/UpdateTaskEndTime", Paras, function (data) {
            if (data == 1) {
                $(".end-time").html(Paras.endTime);
                $(".accept-time").html(new Date().toString("yyyy-MM-dd hh:mm:ss"));
                $(".task-accept").html("<input type='button' class='btn-finishTask' readonly='readonly' value='标记完成' />");
                $(".task-accept").find(".btn-finishTask").bind('click', function () {
                    ObjectJS.showConfirmForm(1);
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
    ObjectJS.finishTask = function () {
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
    ObjectJS.showConfirmForm = function (showStatus) {
        var alertMsg = showStatus == 0 ? "任务到期时间不可逆,确定设置?" : "标记完成的任务不可逆,确定设置?";
        confirm(alertMsg, function () {
            if (showStatus == 0) {
                ObjectJS.setTaskEndTime();
            } else {
                ObjectJS.finishTask();
            }
        });
    }

    //设置图片宽高
    ObjectJS.setImagesSize = function () {
        var documentWidth = $(window).width();
        var ducomentHeight = $(window).height();

        //设置图片显示宽高
        $(".pic-list li").css({ "margin-right": "10px", "border": "1px solid #ccc" });
        $(".pic-list .pic-box img").css({ "width": "100%", "height": "200px" });
        $(".platemakingBody table tr td:last-child").remove();

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
    ObjectJS.getTaskReplys = function () {
        GetOrAddReply = "GetReply";
        if (replyPageCount >= Paras.replyPageIndex) {
            $(".main-box .loading-lump").show();
            $.post("/Task/GetDiscussInfo", Paras, function (data) {
                $(".main-box .loading-lump").hide();
                replyPageCount = data.pagecount;
                if (replyPageCount == 0) {
                    $(".noreply-msg").show();
                }
                else {
                    ObjectJS.GetOrAddTaskReply(data, GetOrAddReply);
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
    ObjectJS.getTaskLogs = function () {
        if (logPageCount >= Paras.logPageIndex) {
            $(".main-box .loading-lump").show();
            $.post("/Task/GetLogInfo", Paras, function (data) {
                $(".main-box .loading-lump").hide();
                logPageCount = data.pagecount;
                if (logPageCount == 0) {
                    $(".log-status").html("<div class='no-log'>暂无数据</div>");
                }
                else {
                    doT.exec("template/task/task-log.html", function (templateFun) {

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

    //获取获取订单材料列表
    ObjectJS.GetOrderDetailsByOrderID = function () {
        Global.post("/Orders/GetOrderDetailsByOrderID", { orderID: Paras.orderID }, function (data) {
            data = JSON.parse(data);
            if (data.items.length == 0) {
                $(".shop-status").html("<div class='no-material'>暂无材料</div>");
            } else {
                doT.exec("template/task/task-products.html", function (templateFun) {
                    var innerText = templateFun(data.items);
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
        });
    }

    //获取或添加任务讨论
    ObjectJS.GetOrAddTaskReply = function (data, replyOperate) {
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
                $('body,html').animate({ scrollTop: WindowScrollTop }, 100);
                $(".talk-main").prepend(innerText);
            }

            //点击回复把用户名写入文本框
            innerText.find(".return-reply .iconfont").click(function () {
                if (IsLoading) {
                    alert("上一条评论发表中,请稍候再试.");
                    return false;
                }
                if ($("#pic-list").length == 0) {
                    $(".reply-layer-content").append('<div class="text-content" style="display:block;min-height:40px;"></div>');
                    $(".reply-layer-content").append('<ul class="pic-list task-file mTop20" id="pic-list" contenteditable="false"></ul><div class="clear"></div>');
                }
                if ($("#doc-list").length == 0) {
                    $(".reply-layer-content").append('<ul class="doc-list task-file mTop20 upload-file" id="doc-list" contenteditable="false"></ul><div class="clear"></div>');
                }
                $("body,html").addClass('layer');
                $(".reply-layer").show();
                setTimeout(function () { $(".reply-layer").css("bottom", "0") }, 10);
                setTimeout(function () { $(".reply-layer-content").focus() }, 1000);

                TaskReplyParas.fromReplyID = $(this).data("replyid");
                TaskReplyParas.fromReplyUserID = $(this).data("userid");
                TaskReplyParas.fromReplyAgentID = $(this).data("agentid");
                $(".reply-title").html('@' + $(this).data('name'));
            });
        });
    }

    //获取手工成本
    ObjectJS.getOrderCosts = function () {
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
    ObjectJS.getPlateMakings = function () {
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

    module.exports = ObjectJS;
});
