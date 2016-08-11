﻿using System;
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

        [Description("/api/task/updateTaskEndTime")]
        UpdateTaskEndTime,

        [Description("/api/task/finishTask")]
        FinishTask,

        [Description("/api/task/savaTaskReply")]
        SavaTaskReply,

        [Description("/api/order/getGoodsDocByOrderID")]
        GetGoodsDocByOrderID,

        [Description("/api/order/getOrderCosts")]
        GetOrderCosts,

        [Description("/api/order/getPlateMakings")]
        GetPlateMakings,

        [Description("/api/order/getOrderDetailsByOrderID")]
        GetOrderDetailsByOrderID
    }
}
