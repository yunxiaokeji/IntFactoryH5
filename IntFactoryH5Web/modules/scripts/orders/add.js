
var viewApi = mui('#createorderbody').view({
    defaultPage: '#main'
});

var view = viewApi.view;
var oldBack = mui.back;
mui.back = function () {
    if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
        viewApi.back();
    } else { //执行webview后退
        oldBack();
    }
};

var addOrder = (function () {
    
    var order = {
        CustomerID: "",
        PersonName: "",
        MobileTele: "",
        OrderType: 1,
        PlanTime: "",
        BigCategoryID: "",
        BigCategoryName: "",
        CategoryID: "",
        CategoryName: "",
        PlanPrice: "",
        PlanQuantity: 1,
        OrderImage:"",
        Remark: ""
    };
    var processcategoryContent;
    var mainContent;
    function init() {
        initMui();
        bindEvent();
        
        getClientProcessCategorys();
        getProductChildCategorysByID();
    }

    function initMui() {
        processcategoryContent = new Vue({
            el: '#processcategory',
            data: {
                processCategorys: []
            },
            methods: {
                setProcessCategory: function (id,name) {
                    mainContent.order.BigCategoryID = id;
                    mainContent.order.BigCategoryName = name;
                    mui.back();
                }
                
            }
        });

        searchcustomerContent = new Vue({
            el: '#searchcustomer',
            data: {
                customers: []
            },
            methods: {
                searchCustomer: function (e) {
                    var _this = $(e.currentTarget);
                    var keywords = _this.val();
                    if(keywords){
                        getCustomersByKeywords(keywords);
                    }
                },
                setCustomer: function (name, mobilePhone) {
                    mainContent.order.PersonName = name;
                    mainContent.order.MobileTele = mobilePhone;
                    mui.back();
                }
            }
        });

        mainContent = new Vue({
            el: '#main',
            data: {
                order: order
            },
            methods: {
                createOrder: function () {
                    createOrder();
                }
               
            }
        });
    }

    function bindEvent() {
        bindDataTimeEvent();

        $("#orderType").bind("tap", function () {
            mui.alert("加载中...");
        });
    }

    function bindDataTimeEvent() {
        $(".datatime").each(function (i, txtDate) {
            $(this).on("click", function () {
                var self = $(this);
                var optionsJson = self.attr('data-options') || '{}';
                var options = JSON.parse(optionsJson);
                var picker = new mui.DtPicker(options);
                if (self.data("date")) {
                    picker.setSelectedValue(self.data("date"));
                }
                picker.show(function (rs) {
                    self.val(rs.text).data("date", rs.text);
                    mainContent.order.PlanTime = rs.text;
                    picker.dispose();
                });
            });
        });
    }

    function getClientProcessCategorys() {
        $.get("/orders/GetClientProcessCategorys", function (data) {
            data=JSON.parse(data);
            if (data.items) {
                processcategoryContent.processCategorys = data.items;


            } else {
                mui.alert("查询失败");
            }
        });
    }

    function getProductChildCategorysByID() {
        $.get("/orders/GetProductChildCategorysByID", function (data) {
            data = JSON.parse(data);
            if (data.items) {
                $("#orderType").unbind().bind("tap", function () {
                    var categorys = [];
                    data.items.forEach(function (item) {
                        var category = {
                            value: item.CategoryID,
                            text: item.CategoryName,
                            children:[]
                        };

                        item.ChildCategory.forEach(function (child) {
                            var categoryChild = {
                                value: child.CategoryID,
                                text: child.CategoryName
                            };
                            category.children.push(categoryChild);
                        });

                        categorys.push(category);
                    });

                    var dailyExpensePicker = new mui.PopPicker({ buttons: ['取消', '完成'], layer: 2 });
                    dailyExpensePicker.setData(categorys);

                    dailyExpensePicker.show(function (items) {
                        var item = items[0];
                        mainContent.order.CategoryID = items[1].value;
                        mainContent.order.CategoryName =items[0].text+"/"+ items[1].text;
                    });
                });

            } else {
                mui.alert("查询失败");
            }
        });
    }

    function getCustomersByKeywords(keywords) {
        $.get("/Customer/GetCustomersByKeywords?keywords=" + keywords, function (data) {
            data = JSON.parse(data);
            if (data.items) {
                searchcustomerContent.customers = data.items;


            } else {
                mui.alert("查询失败");
            }
        });
    }

    function validate() {
        var order =mainContent.order;
        if (!order.BigCategoryID) {
            mui.alert("请选择加工品类");
            return false;
        }
        if (!order.CategoryID) {
            mui.alert("请选择订单分类");
            return false;
        }
        if (!order.PlanTime) {
            mui.alert("请填写交货日期");
            return false;
        }
        if (!order.PlanPrice) {
            mui.alert("请填写期望价格");
            return false;
        } else {
            if (!Global.isDouble(order.PlanPrice)) {
                mui.alert("期望价格格式有误");
                return false;
            }
        }
        if (!order.PersonName) {
            mui.alert("请填写客户姓名");
            return false;
        }
        if (!order.MobileTele) {
            mui.alert("请填写客户联系电话");
            return false;
        } else {
            if (!Global.validateMobilephone(order.MobileTele)) {
                mui.alert("联系电话格式有误");
                return false;
            }
        }

        return true;
    }

    function createOrder() {
        if (!validate()) { return; }

        $.post("/orders/CreateOrder", { entity: JSON.stringify(mainContent.order) }, function (data) {
            data = JSON.parse(data);
            if (data.id) {
                mui.alert("保存成功", function () {
                    location.href = "/orders/list";
                });
            } else {
                mui.alert("保存失败");
            }
        });
    }

    return {
        init:init
    }
})();

$(function () {
    addOrder.init();
});

