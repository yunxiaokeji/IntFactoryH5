define(function (require, exports, module) {
    var Global = null;
    var DoT = null;

    var ObjectJS = {};

    ObjectJS.init = function (global, doT) {
        if (Global == null) {
            Global = require("global");
        }
        else {
            Global = global;
        }
        if (doT == null) {
            Global = require("dot");
        }
        else {
            DoT = doT;
        }
    };

    //获取订单明细
    ObjectJS.getGetGoodsDoc = function (id, type, taskDesc) {
        var _self = this;
        var objHtml = $("#" + id + "");
        if (type == 2) {
            objHtml.find('.tr-header').after($("<tr><td colspan=3><div class='data-loading'></div></td></tr>"));
        } else {
            objHtml.html("<div class='data-loading'></div>");
        }
        
        Global.post("/Orders/GetGoodsDocByOrderID", {
            orderid: _self.orderid,
            taskid: _self.taskid,
            type: type == 22 ? 2 : type
        }, function (data) {
            if (type == 2) {
                objHtml.find('.tr-header').nextAll().remove();
            } else {
                objHtml.html('');
            }
            data = JSON.parse(data);
            data.items.taskDesc = "车缝";
            if (data.items.length > 0) {
                var templateHtml = "template/orders/cutoutdoc.html";
                if (type == 2) {
                    templateHtml = "template/orders/senddydocs.html"
                }
                else if (type == 22) {
                    templateHtml = "template/orders/senddocs.html";
                }

                DoT.exec(templateHtml, function (template) {
                    var innerhtml = template(data.items);
                    innerhtml = $(innerhtml);
                    innerhtml.find('.doc-header').click(function () {
                        var _this = $(this);
                        if (!_this.next().is(":animated")) {
                            if (!_this.hasClass('hover')) {
                                _this.addClass('hover');
                                _this.find('.lump').addClass('hover');
                                _this.next().slideDown(400, function () {
                                });
                            } else {
                                _this.removeClass('hover');
                                _this.find('.lump').removeClass('hover');
                                _this.next().slideUp(400, function () {
                                });
                            }
                        }
                    });

                    objHtml.append(innerhtml);

                    var total = 0;
                    innerhtml.find('.cut1').each(function () {
                        var _this = $(this);
                        total += parseInt(_this.text());
                    });
                    innerhtml.find('.total-count').html(total);
                });
            }
            else {
                if (type == 2) {
                    objHtml.find('.tr-header').after($("<tr><td colspan=3><div class='nodata-txt' >暂无数据!</div></td></tr>"));
                } else {
                    objHtml.append("<div class='nodata-txt' >暂无数据!</div>");
                }
            }
        });
    };

    //获取单据明细
    ObjectJS.getGoodsDocDetail = function (item, type) {
        var _this = $(item), url = "";
        if (type == 1) {
            url = "template/orders/cutout-details.html";
        }
        else if (type == 2) {
            url = "template/orders/send-details.html";
        }

        if (!_this.data("first") || _this.data("first") == 0) {
            _this.data("first", 1).data("status", "open");

            Global.post("/Orders/GetGoodsDocDetail", {
                docid: _this.data("id")
            }, function (data) {
                DoT.exec(url, function (template) {
                    var innerhtml = template(data.model.Details);
                    innerhtml = $(innerhtml);
                    _this.after(innerhtml);
                });
            });
        }
        else {
            if (_this.data("status") == "open") {
                _this.data("status", "close");
                _this.nextAll("tr[data-pid='" + _this.data("id") + "']").hide();
            } else {
                _this.data("status", "open");
                _this.nextAll("tr[data-pid='" + _this.data("id") + "']").show();
            }
        }
    };

    //获取订单明细
    ObjectJS.getOrderGoods = function () {
        Global.post("/Orders/GetOrderGoods", { id: ObjectJS.orderid }, function (data) {
            ObjectJS.OrderGoods = data.list;
        });
    }

    //加载快递公司列表
    ObjectJS.getExpress = function () {
        Global.post("/Plug/GetExpress", {}, function (data) {
            ObjectJS.express = data.items;
        });
    }

    module.exports = ObjectJS;
});