

var orderDetail = (function (mui) {
    var muiContent;
    function init() {
        initMui();
        getOrderDetail();
    }

    function initMui() {
        muiContent = new Vue({
            el: '#orderDetail',
            data: {
                model: {},
                plateMakings:[]
            }
        });
    }

    function bindEvent() {

    }

    function getOrderDetail() {
        var id = Global.GetQueryString("id");
        if (!id) {
            mui.alert("id为空");
        }

        $.get("/orders/GetOrderDetail?id=" + id, function (data) {
            data = JSON.parse(data);
            if (data.item) {
                if (data.item.OrderImages) {
                    data.item.OrderImages = data.item.OrderImages.split(",");
                }

                muiContent.model = data.item;
                setTimeout(function () { mui(".mui-slider").slider(); }, 1000);
                getPlateMakings(id);
            } else {
                mui.alert("查询失败");
            }
        });
    }

    function getPlateMakings(id) {
        $.get("/orders/GetPlateMakings?orderID=" + id, function (data) {
            data = JSON.parse(data);
            if (data.items) {
                muiContent.plateMakings = data.items;
            } else {
                mui.alert("查询失败");
            }
        });
    }

    return {
        init:init
    }
})(mui);

$(function () {
    orderDetail.init();

});