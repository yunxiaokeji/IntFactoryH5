﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using IntFactory.Sdk;
namespace IntFactoryH5Web.Controllers
{
    public class TaskController : BaseController
    {
        //
        // GET: /Task/
        string TaskID = "8e266ab4-0ff6-499b-89ce-d2e3454be123";
        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string agentID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";
       // string processID = "791902e5-27e1-4bb8-a4eb-f7214cdca593";
        Dictionary<string, object> TaskDetail = new Dictionary<string, object>();
        Dictionary<string, object> TaskList = new Dictionary<string, object>();

        public ActionResult List()
        {
            return View();
        }
        
        //页面加载获取任务详情
        public ActionResult Detail(string taskID)
        {

            taskID = TaskID;
            Dictionary<string, object> resultTaskInfoObj = new Dictionary<string, object>();

            var resultTask = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskDetail(taskID, userID, agentID);

            if (resultTask.error_code != 0)
            {
                resultTaskInfoObj.Add("result", 0);
                resultTaskInfoObj.Add("error-msg", resultTask.error_message);
            }
            else
            {
                if (resultTask.task != null)
                {
                    var task = resultTask.task;
                    ViewBag.Task = task;

                }
            }
            return View();
        }

        //获取讨论列表   
        public JsonResult GetDiscussInfo(string orderID, string stageID, int pageIndex)
        {

            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(orderID, stageID, userID, agentID, pageIndex);

            List<IntFactory.Sdk.TaskReplyEntity> listReplys = result.taskReplys;

            JsonDictionary.Add("items", listReplys);

            return new JsonResult
            {

                Data = JsonDictionary,

                JsonRequestBehavior = JsonRequestBehavior.AllowGet

            };
        }

        //获取任务列表
        public JsonResult GetTask(string filter)
        {
            JavaScriptSerializer java = new JavaScriptSerializer();
            var model = java.Deserialize<FilterTasks>(filter);
            var list = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTasks(model, userID, agentID);
            JsonDictionary.Add("items", list.tasks);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取订单任务流程列表
        public JsonResult GetTaskFlow()
        {
            JavaScriptSerializer java = new JavaScriptSerializer();            
            var flowlist = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderProcess(userID, agentID);
            JsonDictionary.Add("items",flowlist.processs);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
        public JsonResult GetLogInfo()
        {
            var result = TaskBusiness.BaseBusiness.GetTaskLogs(TaskID, userID, agentID, 1);
            JsonDictionary.Add("items", result.taskLogs);
            return new JsonResult
            {

                Data=JsonDictionary,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };

        }

        //获取材料采购计划列表
        public JsonResult GetOrderInfo(string orderID)
        {
            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderInfo(orderID, userID, agentID);
            IntFactory.Sdk.OrderBaseEntity orderInfo = result.order;
            JsonDictionary.Add("items", orderInfo);
            return new JsonResult
            {

                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet

            };
        }

    }




}
