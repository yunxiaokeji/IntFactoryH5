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
        Dictionary<string, object> TaskDetail = new Dictionary<string, object>();
        public ActionResult List()
        {
            return View();
        }
        //浏览器加载获取任务详情信息
        public ActionResult Detail(string taskID)
        {

            taskID = "8e266ab4-0ff6-499b-89ce-d2e3454be123";
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
                    
                    //var resultTaskReply = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(resultTask.task.orderID, resultTask.task.stageID, userID, agentID, 1);

                    //ViewBag.TaskReplys = resultTaskReply.taskReplys;
                   
                }
            }
            return View();
        }

        //获取讨论列表   
        public JsonResult GetDiscussInfo(string orderID, string stageID,int pageIndex)
        {

            var result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskReplys(orderID, stageID, userID, agentID, pageIndex);

            List<IntFactory.Sdk.TaskReplyEntity> listReplys = result.taskReplys;

            return new JsonResult { 
            
                Data=listReplys,

                JsonRequestBehavior=JsonRequestBehavior.AllowGet

            };
        }

    }
}
