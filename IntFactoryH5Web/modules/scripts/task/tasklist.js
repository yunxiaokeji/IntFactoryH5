define(function (require,exports,module) {
    var MyListTask = {};
    MyListTask.params = {
        keyWords: "",
        isMy: true,
        userID: "",
        taskType: -1,
        colorMark: -1,
        status: 1,
        finishStatus: -1,
        beginDate: "",
        endDate: "",
        orderType: -1,
        orderProcessID: "-1",
        orderStageID: "-1",
        taskOrderColumn: 0,
        isAsc: 0,
        pageSize: 10,
        pageIndex: 1,
        mark:0,
    };
    MyListTask.init = function () {
        MyListTask.getList();
        MyListTask.bindEvent();        
    };
    MyListTask.bindEvent = function () {
        //遮罩
        $("#cancel-header").click(function () {
            $(".shade").css("display", "block");
        });
        $(".cencal").click(function () {
            var txt = $(".txt-search").val();            
            if (txt!="") {
                MyListTask.params.keyWords = txt;
                MyListTask.getList();
                $(".shade").css("display", "none");
            } else {
                alert("请输入搜索关键字")
                return false;
            }                       
        });

        //点击空白区域
        $(".shade").click(function () {
            $(".shade").css("display","none");
        });

        //冒泡事件
        $(".span-search").click(function () {
            return false;
        });        

        //类型
        $("#type-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            //判断data的值
            var num = $("#type-a").data("type");
            if (num == "0") {
                $(".tab-type").slideDown("slow");
                $("#type-a").data("type", "1");
                $(".all-type").click(function () {
                    var txt = $(".all-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
                $(".DY-type").click(function () {
                    var txt = $(".DY-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
                $(".DH-type").click(function () {
                    var txt = $(".DH-type").text();
                    $(".type-a").text(txt);
                    $(".tab-type").css("display", "none");
                    $("#type-a").data("type", "0");
                });
            } else {
                $(".tab-type").slideUp("slow");
                $("#type-a").data("type", "0");
            }
        });

        //流程
        $("#flow-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            var num = $("#flow-a").data("flow");
            if (num=="0") {
                $(".flow-type").slideDown("slow");
                $("#flow-a").data("flow", "1");             
                $(".all-flow").click(function () {
                    var name = $(".all-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".DY-flow").click(function () {
                    var name = $(".DY-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".DH-flow").click(function () {
                    var name = $(".DH-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
                $(".SC-flow").click(function () {
                    var name = $(".SC-flow").text();
                    $(".flow-a").text(name);
                    $(".flow-type").css("display", "none");
                    $("#flow-a").data("flow", "0");
                });
            } else {
                $(".flow-type").slideUp("slow");
                $("#flow-a").data("flow", "0");
            }
        });

        //筛选来源
        $("#screen-a").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $("#flow-a").data("flow", "0");
            $("#tab-screen").css("display", "none");
            $("#select-copy").data("select", "0");
            var num = $("#screen-a").data("screen");            
            if (num == "0") {
                $(".screen-type").slideDown("slow");                
                $("#screen-a").data("screen", "1");
                $(".all-screen").click(function () {
                    var name = $(".all-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".GC-screen").click(function () {
                    var name = $(".GC-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".ZH-screen").click(function () {
                    var name = $(".ZH-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
                $(".AL-screen").click(function () {
                    var name = $(".AL-screen").text();
                    $(".screen-a").text(name);
                    $(".screen-type").css("display", "none");
                    $("#screen-a").data("screen", "0");
                });
            } else {
                $(".screen-type").slideUp("slow");                
                $("#screen-a").data("screen", "0");
            }
        });

        //排序       
        $("#select-copy").click(function () {
            //当点击此事件时,关闭其他下拉框
            $(".tab-type").css("display", "none");
            $("#type-a").data("type", "0");
            $(".flow-type").css("display", "none");
            $(".flow-type").data("type", "0");
            $(".screen-type").css("display", "none");
            $("#screen-a").data("screen", "0");
            //滑动事件
            var num = $("#select-copy").data("select");          
            if (num == "0") {
                $("#tab-screen").slideDown("slow");
                $("#select-copy").data("select", "1");
                $(".taketime-positive").click(function () {                                       
                    $(".sort-a").text($(".taketime-positive").text());
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
                $(".tasktime-order").click(function () {
                    $(".sort-a").text($(".tasktime-order").text());
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
                $(".expire-positive").click(function () {
                    $(".sort-a").text($(".expire-positive").text());
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
                $(".expire-order").click(function () {
                    $(".sort-a").text($(".expire-order").text());
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
                $(".create-positive").click(function () {
                    $(".sort-a").text($(".create-positive").text());
                    //判断当前浏览器的宽度
                    winWidth = document.body.clientWidth;                    
                    if (winWidth>=550) {
                        $(".select li #select-copy").css("margin-top", "15px");
                    }
                    else {
                        $(".select li #select-copy").css("margin-top","3px");
                    }                    
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
                $(".create-order").click(function () {
                    $(".sort-a").text($(".create-order").text());
                    //判断当前浏览器的宽度
                    winWidth = document.body.clientWidth;
                    if (winWidth >= 550) {
                        $(".select li #select-copy").css("margin-top", "15px");
                    }
                    else {
                        $(".select li #select-copy").css("margin-top", "3px");
                    }
                    $("#tab-screen").slideUp("slow");
                    $("#select-copy").data("select", "0");
                });
            } else {
                $("#tab-screen").slideUp("slow");
                $("#select-copy").data("select", "0");
            }
                       
        });        

        //获取全部状态的任务列表
        $(".task-status li").click(function () {   
            MyListTask.params.finishStatus =$(this).data("status");
            MyListTask.getList();
            
        });
        
        //获取类型的任务列表
        $(".tab-type li").click(function () {
            MyListTask.params.orderType = $(this).data("id");
            MyListTask.getList();
        });

        //获取流程的任务列表
        $("flow-type li").click(function () {
            MyListTask.params.mark = $(this).data("flow");
            MyListTask.getList();
        });
        
    };
    //公共方法
    MyListTask.getList = function () {
        $(".list").empty();
        //获取任务列表(页面加载)
        $.post("/Task/GetTask", { filter: JSON.stringify(MyListTask.params) }, function (data) {
            doT.exec("../modules/template/task/taskListTemplate.html", function (code) {
                var $result = code(data.items);                
                $(".list").append($result);
               
            })
        });

    }

    module.exports = MyListTask;
});