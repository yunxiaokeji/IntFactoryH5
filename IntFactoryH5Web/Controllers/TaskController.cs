using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
namespace IntFactoryH5Web.Controllers
{
    public class TaskController : Controller
    {
        //
        // GET: /Task/

        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string agentID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";
        string TaskID = "8e266ab4-0ff6-499b-89ce-d2e3454be123";
        Dictionary<string, object> JsonResult = new Dictionary<string, object>();
        public ActionResult List()
        {
            return View();
        }

        //浏览器加载获取任务详情信息
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
        public JsonResult GetDiscussInfo(string orderID, string stageID,int pageIndex)
        {
            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(orderID, stageID, userID, agentID, pageIndex);

            List<IntFactory.Sdk.TaskReplyEntity> listReplys = result.taskReplys;

            JsonResult.Add("items", listReplys);

            return new JsonResult {

                Data = JsonResult,

                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };
        }

        //获取日志列表
        public JsonResult GetLogInfo(string taskID)
        {
            taskID = TaskID;

            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskLogs(taskID, userID, agentID, 1);

            List<IntFactory.Sdk.TaskLogEntity> logLists=result.taskLogs;

            JsonResult.Add("items",logLists);

            return new JsonResult {

                Data = JsonResult,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet
            
            };

        }

        //获取材料采购计划列表
        public JsonResult GetOrderInfo(string orderID)
        {
            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetOrderInfo(orderID, userID, agentID);
            IntFactory.Sdk.OrderBaseEntity orderInfo = result.order;
            JsonResult.Add("items",orderInfo);
            return new JsonResult {

                Data = JsonResult,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet
            
            };
        }


    }
}
