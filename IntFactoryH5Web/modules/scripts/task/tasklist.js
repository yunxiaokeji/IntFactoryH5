define(function (require,exports,module) {
    var MyListTask = {};
    MyListTask.init = function () {
        MyListTask.bindEvent();
    };
    MyListTask.bindEvent = function () {
        //遮罩
        $("#cancel-header").click(function () {
            $(".shade").css("display", "block");
        });
        $(".cencal").click(function () {
            $(".shade").css("display", "none");
        });
        //类型
        $("#type-a").click(function () {
            var num = $("#type-a").data("type");
            if (num == "0") {
                $(".option").css("display", "block");
                $("#type-a").data("type", "1");
            } else {
                $(".option").css("display", "none");
                $("#type-a").data("type", "0");
            }
        });
        //高级筛选       
        $("#select-copy").click(function () {
            //$(".tab-screen").slidetoggle();
            var num = $("#select-copy").data("select");
            if (num=="0") {
                $("#tab-screen").css("display", "block");
                $("#select-copy").data("select","1");
            } else {
                $("#tab-screen").css("display", "none");
                $("#select-copy").data("select", "0");
            }            
        });


        
        




    };
    module.exports = MyListTask;
});