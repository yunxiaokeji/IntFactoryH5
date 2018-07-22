

var orderlist = (function (mui) {
    var params = {
        SearchOrderType: 0,
        SearchType: 1,
        TypeID: '',
        Status: -1,
        Mark: -1,
        PayStatus: -1,
        OrderStatus: 0,
        PublicStatus: -1,
        WarningStatus: -1,
        ReturnStatus: -1,
        SourceType: -1,
        UserID: "",
        AgentID: "",
        TeamID: "",
        Keywords: "",
        BeginTime: "",
        EndTime: "",
        EntrustType: "",
        PageIndex: 0,
        PageSize: 5,
        OrderBy: "o.CreateTime desc"
    };

    var filterDatas = [
         {
             key: "WarningStatus",
             title: "订单进度",
             data: [
                 { id: "-1", name: "全部" },
                 { id: "1", name: "快到期" },
                 { id: "2", name: "已超期" }
             ]
         },
         {
            key: "SourceType",
            title: "订单来源",
            data:[
                { id: "-1", name: "全部" },
                { id: "1", name: "工厂" },
                { id: "2", name: "客户自助" },
                { id: "3", name: "淘工厂" },
                { id: "4", name: "客户端" }
            ]
        }
    ];

    var headFilterDataOfNeed= {
        key: "TypeID",
        title: "订单类型",
        data: [
            { id: "", name: "所有",count:0,lable:"all" },
            { id: "1", name: "打样", count: 0, lable: "dy" },
            { id: "2", name: "大货", count: 0, lable: "dh" }
        ]
    }

    var headFilterDataOfOrder = {
        key: "OrderStatus",
        title: "订单状态",
        data: [
             { id: "1",name: "进行中", count: 0, lable: "normal"},
             { id: "2", name: "已完成", count: 0, lable: "complete" },
            { id: "8", name: "已终止", count: 0, lable: "over" },
            { id: "-1", name: "已归档", count: 0, lable: "archiving" },
            { id: "-1", name: "所有", count: 0, lable: "all" },
        ]
    }

    var negativeFilterData = {
        key: "SearchOrderType",
        title: "订单类别",
        data: [
            { id: "0", name: "需求单",active:true },
            { id: "1", name: "打样单", active: false },
            { id: "2", name: "大货单", active: false }
        ]
    }

    var muiContent;
    var headFilterContent;
    var lableid;
    function init() {
        initMui();
        bindEvent();
        bindSearchEvent();
        bindFilterEvent();
        //searchList();
        //getLableColors();
        searchTotalCount();
    }

    function initMui() {
        muiContent = new Vue({
            el: '#offCanvasWrapper',
            data: {
                userinfo: Global.currentUser,
                filterDatas: filterDatas,
                negativeFilterData:negativeFilterData,
                listData: [],
                firstFilterData: headFilterDataOfNeed.data[0]
            }
        });
        lableid = headFilterDataOfNeed.data[0].lable;

        headFilterContent = new Vue({
            el: '#HeadFilter',
            data: {
                headFilterData: headFilterDataOfNeed
            },
            methods: {
                headFilterClick: function (e) {
                    var _this = $(e.currentTarget);
                    var key = $(_this).attr("paraskey");
                    
                    if (lableid != $(_this).attr("lableid")) {
                        params[key] = $(_this).attr("orderstatus");
                        lableid = $(_this).attr("lableid");
                        if (lableid == "archiving") {
                            params.WarningStatus = 9;
                        } else {
                            params.WarningStatus = -1;
                        }

                        muiContent.firstFilterData = {
                            name: $(_this).attr("name"),
                            count: $(_this).attr("count")
                        };

                        searchList();
                    }
                    mui("#HeadFilter").popover('hide');
                }
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
            var id = $(this).data("id");
            if (params[key] != id) {
                params[key] = id;

                //切换订单类型时  重置头部过滤器
                params.TypeID = "";
                params.WarningStatus = -1;
                if (id == "0") {
                    headFilterContent.headFilterData = headFilterDataOfNeed;
                    params.OrderStatus = 0;
                } else {
                    headFilterContent.headFilterData = headFilterDataOfOrder;
                    params["OrderStatus"] = headFilterContent.headFilterData.data[0].id;
                }
                lableid = headFilterContent.headFilterData.data[0].lable;

                searchList();
                searchTotalCount();
            }
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
            var keyword=$("#txtKeywords").val();
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
        $.post("/orders/getorders", { filter: JSON.stringify(params) }, function (data) {
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

    function searchTotalCount() {
        $.get("/orders/GetOrderTotalCount", { searchOrderType: params.SearchOrderType }, function (data) {
            data = JSON.parse(data);
            if (data) {
                headFilterContent.headFilterData.data.forEach(function (filter) {
                    if (filter.lable == "dy") {
                        filter.count = data.dy;
                    } else if (filter.lable == "dh") {
                        filter.count = data.dh;
                    }else if (filter.lable == "normal") {
                        filter.count = data.normal;
                    } else if (filter.lable == "complete") {
                        filter.count = data.complete;
                    } else if (filter.lable == "over") {
                        filter.count = data.over;
                    } else if (filter.lable == "archiving") {
                        filter.count = data.archiving;
                    } else if (filter.lable == "all") {
                        filter.count = data.dy + data.dh + data.normal + data.complete;
                    }
                });

                muiContent.firstFilterData = headFilterContent.headFilterData.data[0];
            }

        });
    }

    function pullUpRefresh() {
        setTimeout(function () {
            params.PageIndex++
            searchList(params.PageIndex);
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
                    name:"全部"
                }]
            };
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                filterData.data.push({
                    id: item.ColorID,
                    name:item.ColorName
                });
            }
            muiContent.filterDatas.push(filterData);
        });
    };

    return {
        init:init
    }

})(mui);

$(function () {
    orderlist.init();
});

