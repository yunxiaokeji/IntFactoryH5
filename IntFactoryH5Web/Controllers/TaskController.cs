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
        public ActionResult List()
        {
            ViewBag.UserID = CurrentUser.userID;
            ViewBag.UserName = CurrentUser.name;

            return View();
        }

        public ActionResult List2()
        {
            ViewBag.UserID = CurrentUser.userID;

            return View();
        }
        public ActionResult Detail(string id)
        {
            Dictionary<string, object> resultTaskInfoObj = new Dictionary<string, object>();
            var resultTask = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskDetail(id, CurrentUser.userID, CurrentUser.clientID);

            if (resultTask.error_code != 0)
            {
                Response.Write("<script>alert('页面出现才错误');location.href='/task/list';</script>");
                Response.End();
            }
            else
            {
                if (resultTask.task != null)
                {
                    UserBase userBase = new UserBase();
                    var task = resultTask.task;

                    //当前用户是否有编辑权限
                    var isEditTask = false;
                    TaskMember member = task.TaskMembers.Find(a => a.MemberID.ToLower() == CurrentUser.userID.ToLower());
                    if (member != null)
                    {
                        if (member.PermissionType == 2)
                        {
                            isEditTask = true;
                        }
                    }
                    ViewBag.IsEditTask = isEditTask;
                    ViewBag.Task = task;
                    ViewBag.DomainUrl = resultTask.domainUrl;
                    ViewBag.Users = CurrentUser;
                    ViewBag.ModuleName = resultTask.moduleName;
                }
                else {
                    Response.Write("<script>alert('任务不存在');location.href='/task/list';</script>");
                    Response.End();
                }
            }
            return View();
        }

        //获取讨论列表   
        public JsonResult GetDiscussInfo(string taskID, string stageID, int replyPageIndex)
        {
            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(taskID, stageID, CurrentUser.userID, CurrentUser.clientID, replyPageIndex);

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
            var data = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTasks(model, CurrentUser.userID, CurrentUser.clientID);
            
            //JsonDictionary.Add("items", list.tasks);
            //JsonDictionary.Add("pageCount",list.pageCount);
            //JsonDictionary.Add("totalCount",list.totalCount);
            //JsonDictionary.Add("userName",CurrentUser.name );
            return new JsonResult
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetTaskTotalCount(int filterType) {
            var data = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskTotalCount(filterType, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = data,
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

        public JsonResult GetTaskLableColors()
        {
            var lables = TaskBusiness.BaseBusiness.GetTaskLableColors(CurrentUser.userID,CurrentUser.clientID);

            return new JsonResult
            {
                Data = lables,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //添加讨论信息
        [ValidateInput(false)]
        public JsonResult AddTaskReply(string resultReply,string entityAttachments)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            TaskReplyEntity taskReplyEntity = new TaskReplyEntity();
            List<AttachmentEntity> attachments = new List<AttachmentEntity>();
            taskReplyEntity = serializer.Deserialize<TaskReplyEntity>(resultReply);
            taskReplyEntity.attachments = serializer.Deserialize<List<AttachmentEntity>>(entityAttachments);
            TaskReplyListResult addResult = TaskBusiness.BaseBusiness.SavaTaskReply(taskReplyEntity, taskReplyEntity.taskID, CurrentUser.userID, CurrentUser.clientID);
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

        //锁定任务
        public string LockTask(string taskID)
        {
            return TaskBusiness.BaseBusiness.LockTask(taskID, CurrentUser.userID, CurrentUser.clientID);
        }

    }




}
