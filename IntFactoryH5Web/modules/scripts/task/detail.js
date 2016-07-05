define(function (require, exports, module) {

    var Global = require("global"),
        Upload = require("upload");
        
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

    //判断是否加载中
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
        TaskDetail.initStyle();
        //调用绑定选择时间控件(绑定设置到期时间事件)
        TaskDetail.bindTimerPicker();
        TaskDetail.setImagesSize();
    }
   
    //初始化样式信息
    TaskDetail.initStyle = function () {
        var documentWidth = $(window).width();
        var ducomentHeight = $(window).height();

        //设置讨论内容高度
        //$(".reply-layer-content").css({ "height": ducomentHeight - 20 - 60 - 81 - 30 + "px" });
        //设置图片显示宽高
        $(".pic-list .pic-box img").css({ "width": "100%", "height": "200px" });
        $(".pic-list .pic-box img").css({ "margin-right": "10px" });
        $(".platemakingBody table tr td:last-child").remove();
    }

    //绑定事件
    TaskDetail.bindEvent = function () {
        //是否绑定滑屏控件事件
        if (TaskDetail.imgStatus == 1) {
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
            $(".main-box ." + classname).show().siblings().hide();
            $(".main-box").css("margin-bottom", "0px");
            bind = classname;
            //点击讨论模块
            if (classname == "talk-status") {
                $(".main-box").css("margin-bottom", "80px");
            }
            //点击材料计划模块
            else if (classname == "shop-status") {
                $(".main-box .loading-lump").hide();
            }
            //点击日志模块
            else if (classname == "log-status") {

                if (LogIsPageCount) {
                    TaskDetail.getTaskLogs();
                    LogIsPageCount = false;
                }
            }
            //点击制版模块
            else if (classname == "print-status") {
            }
        });

        //点击回到顶部
        $(".getback").click(function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        });

        //点击提交按钮
        $(".btn-submit").bind("click", function () {
            GetOrAddReply = "AddReply";
            AddReplyParas.content = $(".txt-talkcontent").val().replace(Content, "");

            if (AddReplyParas.content == "") { return; }

            if (AddReplyParas.content.length >= 999) { alert("您输入的文字超过500个"); return; }

            if ($(".txt-talkcontent").val().indexOf(Content) != 0) {

                AddReplyParas.fromReplyID = "";

                AddReplyParas.fromReplyUserID = "";

                AddReplyParas.fromReplyAgentID = "";

            }
            var msgReply = JSON.stringify(AddReplyParas);
            $(this).val("提交中...").attr("disabled", "disabled");

            $.post("/Task/AddTaskReply", {
                resultReply: msgReply
            }, function (data) {
                $(".btn-submit").val("提交").removeAttr("disabled");
                TaskDetail.GetOrAddTaskReply(data, GetOrAddReply);
            });
        });
     
        //绑定完成任务
        if ($(".btn-finishTask").length > 0) {
            if ($('.btn-finishTask').val() == "标记完成") {
                if (TaskDetail.operateStatus) {
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
            }else {
                divContent = newHtml.html();
            }
            AddReplyParas.content = divContent;
            var msgReply = JSON.stringify(AddReplyParas);

            IsLoading = true;
            $.post("/Task/AddTaskReply", { resultReply: msgReply }, function (data) {
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
        if (!TaskDetail.operateStatus) { return; }
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
            }else if (data == 0) {
                alert("失败");
            }else if (data == 2) {
                alert("有前面阶段任务未完成");
            }else if (data == 3) {
                alert("没有权限;");
            }else if (data == 4) {
                alert("任务没有接受，不能设置完成");
            }else if (data == 5) {
                alert("任务有未完成步骤");
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
                    doT.exec("/modules/template/task/detailLog.html", function (templateFun) {

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
            doT.exec("/modules/template/task/materList.html", function (templateFun) {
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

    //接受任务、标记任务完成的弹出浮层
    TaskDetail.showConfirmForm = function (showStatus) {

        var alertMsg = showStatus == 0 ? "任务到期时间不可逆,确定设置?" : "标记完成的任务不可逆,确定设置?";
        confirm(alertMsg, function () {
            if (showStatus == 0) {
                TaskDetail.setTaskEndTime();
            }   else {
                TaskDetail.finishTask();
            }
        });

    }
        
    //设置图片宽高
    TaskDetail.setImagesSize = function () {
        $(".main_image").css("height", $(window).width() + "px");
        $(".main_image").css("width", $(window).width() + "px");
        $(".main_image li").css("height", $(window).width() + "px");
        $(".main_image ul li").each(function () {
            if ($(this).find('img').width() > $(this).find('img').height()) {
                $(this).find('img').css("height", $(window).width() + "px");
            } else {
                $(this).find('img').css("width", $(window).width() + "px");
            }
        })
    }


    //获取或添加任务讨论
    TaskDetail.GetOrAddTaskReply = function (data, replyOperate) {
        doT.exec("/modules/template/task/newDetailReply.html", function (templateFun) {
            var innerText = templateFun(data.items);
            innerText = $(innerText);

            if (GetOrAddReply == "GetReply") {
                $(".talk-main").append(innerText);
                //innerText.find(".reply-content").each(function () {
                //    $(this).html(Global.replaceQqface($(this).html()));
                //    $(this).find("img").css({ "width": "36px", "height": "36px" });
                //});
            }else {
                if ($(".talk-main").find('div').length == 0) {
                    $(".noreply-msg").hide();
                }
                $(".talk-main").prepend(innerText);
            }

            //点击回复把用户名写入文本框
            innerText.find(".iconfont").click(function () {
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

    module.exports = TaskDetail;

})