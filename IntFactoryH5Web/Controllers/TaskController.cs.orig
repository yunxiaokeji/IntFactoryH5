using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using IntFactory.Sdk;
using System.Web.Script.Serialization;
namespace IntFactoryH5Web.Controllers
{
    [IntFactoryH5Web.Common.UserAuthorize]
    public class TaskController : BaseController
    {
        //
        // GET: /Task/
        //8e266ab4-0ff6-499b-89ce-d2e3454be123
        //765f89a5-f3a6-4eb0-b9ba-b3813354e582
        //string TaskID = "58a189dc-8e6b-4eaa-b6b9-785fe738e2de";
        
        //string CurrentUser.userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        //string CurrentUser.agentID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";


        string processID = "791902e5-27e1-4bb8-a4eb-f7214cdca593";
        //Dictionary<string, object> TaskDetail = new Dictionary<string, object>();
        //Dictionary<string, object> TaskList = new Dictionary<string, object>();

        public ActionResult List()
        {
            return View();
        }
        
        //页面加载获取任务详情
        public ActionResult Detail(string id)
        {
            Dictionary<string, object> resultTaskInfoObj = new Dictionary<string, object>();

            var resultTask = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskDetail(id, CurrentUser.userID, CurrentUser.agentID);

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

            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(orderID, stageID, CurrentUser.userID, CurrentUser.agentID, pageIndex);

            List<IntFactory.Sdk.TaskReplyEntity> listReplys = result.taskReplys;

            JsonDictionary.Add("items", listReplys);

            JsonDictionary.Add("totalcount", result.totalCount);

            JsonDictionary.Add("pagecount", result.pageCount);

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
            var list = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTasks(model, CurrentUser.userID, CurrentUser.agentID);
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
            var flowlist = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderProcess(CurrentUser.userID, CurrentUser.agentID);
            JsonDictionary.Add("items",flowlist.processs);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取订单任务流程阶段列表
        public JsonResult GetTaskFlowStage()
        {
            var model = TaskBusiness.BaseBusiness.GetOrderStages(processID, CurrentUser.userID, CurrentUser.agentID);
            JsonDictionary.Add("items",model.processStages);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        
        //获取日志信息
        public JsonResult GetLogInfo(string taskID, int pageIndex)
        {
            var result = TaskBusiness.BaseBusiness.GetTaskLogs(taskID, CurrentUser.userID, CurrentUser.agentID, pageIndex);
            JsonDictionary.Add("items", result.taskLogs);
            JsonDictionary.Add("pagecount", result.pageCount);
            return new JsonResult
            {

                Data=JsonDictionary,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };

        }

        //获取材料采购计划列表
        public JsonResult GetOrderInfo(string orderID)
        {
            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderInfo(orderID, CurrentUser.userID, CurrentUser.agentID);
            JsonDictionary.Add("items", result.materialList);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //添加讨论信息
        public JsonResult AddTaskReply()
        {
            string result = Request["resultReply"].ToString();

            JavaScriptSerializer serializer = new JavaScriptSerializer();

            TaskReplyEntity taskReplyEntity = new TaskReplyEntity();

            taskReplyEntity = serializer.Deserialize<TaskReplyEntity>(result);

            TaskReplyListResult addResult = TaskBusiness.BaseBusiness.SavaTaskReply(taskReplyEntity, CurrentUser.userID, CurrentUser.agentID);

            JsonDictionary.Add("items", addResult.taskReplys);

            return new JsonResult { 
            
                Data=JsonDictionary,

                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };
        }

        //更新任务到期时间
        public int UpdateTaskEndTime(string taskID,string endTime)
        {
            var result = TaskBusiness.BaseBusiness.UpdateTaskEndTime(taskID, endTime, CurrentUser.userID, CurrentUser.agentID);

            return result.result;
        }

        //标记完成任务
        public int FinishTask(string taskID) 
        {

            var result = TaskBusiness.BaseBusiness.FinishTask(taskID, CurrentUser.userID, CurrentUser.agentID);

            return result.result;
;
        }

    }




}
