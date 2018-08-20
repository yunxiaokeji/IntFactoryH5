﻿

var tasklist = (function (mui) {
    var params = {
        SearchType: 3,
        Type: -1,
        SourceType: -1,
        SourceID: "",
        StageID: "",
        Status: 1,
        FirstName: "",
        Mark: -1,
        UserID: "",
        AgentID: "",
        TeamID: "",
        Keywords: "",
        BeginTime: "",
        EndTime: "",
        
        OrderBy: "cus.CreateTime desc",
        PageIndex: 0,
        PageSize: 5
    };
    var filterDatas = [
         //{
         //    key: "OrderType",
         //    title: "订单类型",
         //    data: [
         //        { id: "-1", name: "全部" },
         //        { id: "1", name: "打样单" },
         //        { id: "2", name: "大货单" }
         //    ]
         //}
    ];
    var headFilterData = {
        key: "Type",
        data: [
            { id: "-1", name: "我的客户" }
        ]
    }
    var negativeFilterData = {
        key: "SourceType",
        data: [
            { id: "-1", name: "全部", active: true },
            { id: "1", name: "阿里客户", active: false },
            { id: "2", name: "自助下单", active: false },
            { id: "3", name: "手工创建", active: false }
        ]
    }
    var muiContent;
    var headFilterContent;
    function init() {
        initMui();
        bindEvent();
        bindSearchEvent();
        bindFilterEvent();
        searchList();
        getLableColors();
    }

    function initMui() {
        muiContent = new Vue({
            el: '#offCanvasWrapper',
            data: {
                userinfo: Global.currentUser,
                filterDatas: filterDatas,
                negativeFilterData: negativeFilterData,
                listData: [],
                headFilterName: "我的客户"
            },
            methods: {
                callMobile: function (e) {
                    var _this = $(e.currentTarget);
                    location.href = "tel:" + _this.data("mobile");
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
        $.post("/Customer/GetCustomers", { filter: JSON.stringify(params) }, function (data) {
            data = JSON.parse(data);
            mui('#pullrefresh').pullRefresh().endPullupToRefresh((data.pageCount == params.PageIndex || data.pageCount == 0));
            if (data.items) {
                var items = data.items;
                items.forEach(function (item) {
                    muiContent.listData.push(item);
                });

                //if (data.pageCount == params.PageIndex || data.pageCount == 0) {
                //    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                //}
                
            } else {
                mui.alert("查询失败");
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
                key: "Mark",
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

    return {
        init: init
    }

})(mui);

$(function () {
    tasklist.init();
});
