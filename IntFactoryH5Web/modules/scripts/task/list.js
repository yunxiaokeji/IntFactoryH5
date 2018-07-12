

var tasklist = (function (mui) {
    var params = {
        Keywords: "",
        FilterType: 1,
        OrderType: -1,
        ColorMark: -1,
        FinishStatus: 0,
        InvoiceStatus:-1,
        userID: "",
        taskType: -1,
        beginDate: "",
        endDate: "",
        
        taskOrderColumn: 0,
        isAsc: 0,
        PageSize: 5,
        PageIndex: 0
    };
    var filterDatas = [
         {
             key: "OrderType",
             title: "订单类型",
             data: [
                 { id: "-1", name: "全部" },
                 { id: "1", name: "打样单" },
                 { id: "2", name: "大货单" }
             ]
         },
          {
              key: "InvoiceStatus",
              title: "任务进度",
              data: [
                  { id: "-1", name: "全部" },
                  { id: "1", name: "快到期" },
                  { id: "2", name: "已超期" }
              ]
          }
    ];
    var headFilterData = {
        key: "FilterType",
        data: [
            //{ id: "-1", name: "所有任务" },
            { id: "1", name: "我的任务" },
            { id: "2", name: "参与任务" }
        ]
    }
    var negativeFilterData = {
        key: "FinishStatus",
        data: [
            { id: "0", name: "未接受", active: true, count: 0, lable: "nobegin" },
            { id: "1", name: "进行中", active: false, count: 0, lable: "normal" },
            { id: "2", name: "已完成", active: false, count: 0, lable: "complete" },
            { id: "-1", name: "全部", active: false, count: 0, lable: "all" }
        ]
    }
    var muiContent;
    var headFilterContent;
    function init() {
        initMui();
        bindEvent();
        bindSearchEvent();
        bindFilterEvent();
        //searchList();

        getLableColors();
        searchTotalCount();
        //getPassportInfo();
    }

    function initMui() {
        muiContent = new Vue({
            el: '#offCanvasWrapper',
            data: {
                userinfo: Global.currentUser,
                filterDatas: filterDatas,
                negativeFilterData: negativeFilterData,
                listData: [],
                headFilterName: "我的任务"
            },
            methods: {
                goDetail: function (e) {
                    var _this = $(e.currentTarget);
                    location.href = "/task/detail/" + _this.data("id");
                }
            }
        });

        headFilterContent = new Vue({
            el: '#HeadFilter',
            data: {
                headFilterData: headFilterData
            }
        });

        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                //down: {
                //    //callback: pulldownRefresh
                //},
                up: {
                    height: 50,
                    contentrefresh: '正在加载...',
                    contentnomore: '没有更多数据了',
                    callback: pullUpRefresh
                }
            }
        });

        if (mui.os.plus) {
            mui.plusReady(function () {
                setTimeout(function () {
                    mui('#pullrefresh').pullRefresh().pullupLoading();
                }, 1000);

            });
        } else {
            mui.ready(function () {
                mui('#pullrefresh').pullRefresh().pullupLoading();
            });
        }

        //主界面和侧滑菜单界面均支持区域滚动；
        mui('#offCanvasSideScroll').scroll();
        mui('#offCanvasContentScroll').scroll();
        //实现ios平台原生侧滑关闭页面；
        if (mui.os.plus && mui.os.ios) {
            mui.plusReady(function () { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
                plus.webview.currentWebview().setStyle({
                    'popGesture': 'none'
                });
            });
        }
    }

    function bindEvent() {
        $("#NegativeFilter a").on("tap", function () {
            var key = $(this).data("key");
            if (params[key] != $(this).data("id")) {
                params[key] = $(this).data("id");
                searchList();
            }
        });

        $("#HeadFilter ul li").on("tap", function () {
            var key = $(this).data("key");
            if (params[key] != $(this).data("id")) {
                params[key] = $(this).data("id");
                muiContent.headFilterName = $(this).find("a").html();
                searchList();
                searchTotalCount();
            }

            mui("#HeadFilter").popover('hide');
        });
    }

    function bindSearchEvent() {
        $("#icoSearch").on("tap", function () {
            $("#layerOfSearch,.search-layer").show();
        });

        $("#layerOfSearch").click(function () {
            $("#layerOfSearch,.search-layer").hide();
        });

        $("#btnSearch").on("tap", function () {
            var keyword = $("#txtKeywords").val();
            if (keyword != params.Keywords) {
                params.Keywords = keyword;
                searchList();
                $("#btnCancelSearch").show();
                $("#layerOfSearch").hide();
            }
            else {
                $("#layerOfSearch,.search-layer").hide();
            }
        });

        $("#btnCancelSearch").on("tap", function () {
            $("#layerOfSearch,.search-layer").hide();
            $("#txtKeywords").val("");
            params.Keywords = "";
            searchList();
        });
    }

    function bindFilterEvent() {
        $("#offCanvasShow").on("tap", function () {
            mui('.mui-off-canvas-wrap').offCanvas('show');
        });

        document.getElementById('btnFilterSearch').addEventListener('tap', function () {
            filterDatas.forEach(function (filterData) {
                params[filterData.key] = $("#filterContent input[name='" + filterData.key + "']:checked").data("id");
            });
            mui('.mui-off-canvas-wrap').offCanvas('close');

            searchList();
        });
    }

    function searchList(pageIndex) {
        if (pageIndex) {
            params.PageIndex = pageIndex;
            if (pageIndex == 1) {
                mui('#pullrefresh').pullRefresh().scrollTo(0, 0);
            }
        } else {
            params.PageIndex = 1;
            muiContent.listData = [];
            mui('#pullrefresh').pullRefresh().refresh(true);
            mui('#pullrefresh').pullRefresh().scrollTo(0, 0);
        }
        $.post("/Task/GetTask", { filter: JSON.stringify(params) }, function (data) {
            mui('#pullrefresh').pullRefresh().endPullupToRefresh((data.pageCount == params.PageIndex || data.pageCount == 0));
            if (data.items) {
                var items = data.items;
                items.forEach(function (item) {
                    muiContent.listData.push(item);
                });
            } else {
                mui.alert("查询失败");
            }
        });
    }

    function searchTotalCount() {
        $.get("/task/getTaskTotalCount", { filterType: params.FilterType }, function (data) {
            data = JSON.parse(data);
            if (data) {
                muiContent.negativeFilterData.data.forEach(function (filter) {
                    if (filter.lable == "nobegin") {
                        filter.count = data.nobegin;
                    } else if (filter.lable == "normal") {
                        filter.count = data.normal;
                    } else if (filter.lable == "complete") {
                        filter.count = data.complete;
                    }else if (filter.lable == "all") {
                        filter.count =data.nobegin+data.normal+ data.complete;
                    }
                });
            }
            
        });
    }

    function pullUpRefresh() {
        setTimeout(function () {
            params.PageIndex++
            searchList(params.PageIndex);
            //mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 10));
        }, 1000);
    }

    function getLableColors() {
        $.post("/Task/GetTaskLableColors", {}, function (data) {
            data = JSON.parse(data);
            var items = data.items;
            var filterData = {
                title: "颜色标记",
                key: "ColorMark",
                data: [{
                    id: -1,
                    name: "全部"
                }]
            };
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                filterData.data.push({
                    id: item.ColorID,
                    name: item.ColorName
                });
            }
            muiContent.filterDatas.push(filterData);
        });
    };

    function getPassportInfo() {
        $.get("/passport/getPassportInfo", function (data) {
            Global.setCookie("userinfo", data);
            muiContent.userinfo = JSON.parse(data);
        });
    }
    return {
        init: init
    }

})(mui);

$(function () {
    tasklist.init();
});

