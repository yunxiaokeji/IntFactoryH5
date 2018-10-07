using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    public enum ApiOption
    {
        [Description("getToken")]
        GetToken,

        [Description("/api/user/userLogin")]
        UserLogin,

        [Description("/api/user/getUserByWeiXinMP")]
        GetUserByWeiXinMP,

        [Description("/api/user/bindWeiXinMP")]
        BindWeiXinMP,

        [Description("member.get")]
        MemberDetail,

        [Description("/api/task/getTasks")]
        GetTasks,

        [Description("/api/task/GetTaskTotalCount")]
        GetTaskTotalCount,

        [Description("/api/task/getOrderProcess")]
        GetOrderProcess,

        [Description("/api/task/getOrderStages")]
        GetOrderStages,

        [Description("/api/task/getTaskDetail")]
        GetTaskDetail,

        [Description("/api/task/getTaskReplys")]
        GetTaskReplys,

        [Description("/api/task/getTaskLogs")]
        GetTaskLogs,

        [Description("/api/task/getOrderInfo")]
        GetOrderInfo,

        [Description("/api/task/getTaskLableColors")]
        GetTaskLableColors,

        [Description("/api/task/updateTaskEndTime")]
        UpdateTaskEndTime,

        [Description("/api/task/finishTask")]
        FinishTask,

        [Description("/api/task/savaTaskReply")]
        SavaTaskReply,

        [Description("/api/order/GetOrders")]
        GetOrders,

        [Description("/api/order/GetOrderDetail")]
        GetOrderDetail,

        [Description("/api/order/GetClientProcessCategorys")]
        GetClientProcessCategorys,

        [Description("/api/order/GetProductChildCategorysByID")]
        GetProductChildCategorysByID,

        [Description("/api/order/GetOrderTotalCount")]
        GetOrderTotalCount,

        [Description("/api/order/getGoodsDocByOrderID")]
        GetGoodsDocByOrderID,

        [Description("/api/order/getOrderCosts")]
        GetOrderCosts,

        [Description("/api/order/getPlateMakings")]
        GetPlateMakings,

        [Description("/api/order/getOrderDetailsByOrderID")]
        GetOrderDetailsByOrderID,

        [Description("/api/task/CreateOrderGoodsDoc")]
        CreateOrderGoodsDoc,

        [Description("/api/order/GetOrderGoods")]
        GetOrderGoods,

        [Description("/api/task/LockTask")]
        LockTask,

        [Description("/api/Customer/GetCustomers")]
        GetCustomers,

        [Description("/api/Customer/GetCustomersByKeywords")]
        GetCustomersByKeywords,

        [Description("/api/Customer/GetCitys")]
        GetCitys,

        [Description("/api/Customer/SaveCustomer")]
        CreateCustomer,

        [Description("/api/order/CreateOrder")]
        CreateOrder
    }
}
