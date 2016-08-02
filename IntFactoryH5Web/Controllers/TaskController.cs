using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using IntFactory.Sdk;
namespace IntFactoryH5Web.Controllers
{
    [IntFactoryH5Web.Common.UserAuthorize]
    public class TaskController : BaseController
    {
        //
        // GET: /Task/

        //string processID = "791902e5-27e1-4bb8-a4eb-f7214cdca593";

        public ActionResult List()
        {
            return View();
        }
        
        //页面加载获取任务详情
        public ActionResult Detail(string id)
        {
            Dictionary<string, object> resultTaskInfoObj = new Dictionary<string, object>();

            var resultTask = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskDetail(id, CurrentUser.userID, CurrentUser.clientID);

            if (resultTask.error_code != 0)
            {
                resultTaskInfoObj.Add("result", 0);
                resultTaskInfoObj.Add("error-msg", resultTask.error_message);
            }
            else
            {
                if (resultTask.task != null)
                {
                    UserBase userBase = new UserBase();
                    var task = resultTask.task;
                    ViewBag.Task = task;
                    ViewBag.DomainUrl = resultTask.domainUrl;
                    JavaScriptSerializer serializer=new JavaScriptSerializer();
                    ViewBag.MaterialList =serializer.Serialize(resultTask.materialList);
                    ViewBag.UserID = CurrentUser.userID;
                }
            }
            return View();
        }

        //获取讨论列表   
        public JsonResult GetDiscussInfo(string orderID, string stageID, int replayPageIndex)
        {

            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(orderID, stageID, CurrentUser.userID, CurrentUser.clientID, replayPageIndex);

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
            var list = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTasks(model, CurrentUser.userID, CurrentUser.clientID);
            JsonDictionary.Add("items", list.tasks);
            JsonDictionary.Add("pageCount",list.pageCount);
            JsonDictionary.Add("totalCount",list.totalCount);
            JsonDictionary.Add("userName",CurrentUser.name );
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取订单任务流程列表
        public JsonResult GetTaskFlow()
        {                
            var flowlist = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderProcess(CurrentUser.userID, CurrentUser.clientID);
            JsonDictionary.Add("items",flowlist.processs);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取订单任务流程阶段列表
        public JsonResult GetTaskFlowStage(string processID)
        {
            var model = TaskBusiness.BaseBusiness.GetOrderStages(processID, CurrentUser.userID, CurrentUser.clientID);
            JsonDictionary.Add("items",model.processStages);
            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
      
        //获取日志列表
        public JsonResult GetLogInfo(string taskID, int logPageIndex)
        {
            var result = TaskBusiness.BaseBusiness.GetTaskLogs(taskID, CurrentUser.userID, CurrentUser.clientID, logPageIndex);
            JsonDictionary.Add("items", result.taskLogs);
            JsonDictionary.Add("pagecount", result.pageCount);
            JsonDictionary.Add("totalcount", result.totalCount);
            return new JsonResult
            {
                Data=JsonDictionary,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };

        }

        //添加讨论信息
        [ValidateInput(false)]
        public JsonResult AddTaskReply(string resultReply,string taskID,string entityAttachments)
        {

            JavaScriptSerializer serializer = new JavaScriptSerializer();

            TaskReplyEntity taskReplyEntity = new TaskReplyEntity();
            List<AttachmentEntity> attachments = new List<AttachmentEntity>();
            taskReplyEntity = serializer.Deserialize<TaskReplyEntity>(resultReply);
            taskReplyEntity.attachments = serializer.Deserialize<List<AttachmentEntity>>(entityAttachments);
            TaskReplyListResult addResult = TaskBusiness.BaseBusiness.SavaTaskReply(taskReplyEntity, taskID, CurrentUser.userID, CurrentUser.clientID);
           
            JsonDictionary.Add("items", addResult.taskReplys);

            return new JsonResult { 
            
                Data=JsonDictionary,

                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };
        }

        //更新任务到期时间
        public int UpdateTaskEndTime(string endTime,string taskID)
        {
            var result = TaskBusiness.BaseBusiness.UpdateTaskEndTime(taskID, endTime, CurrentUser.userID, CurrentUser.clientID);

            return result.result;
        }

        //标记完成任务
        public int FinishTask(string taskID) 
        {

            var result = TaskBusiness.BaseBusiness.FinishTask(taskID, CurrentUser.userID, CurrentUser.clientID);

            return result.result;
;
        }

    }




}
