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

        public ActionResult List()
        {
            return View();
        }

        public ActionResult Detail()

        {
            return View();
        }
        public JsonResult GetTaskList(string taskID)
        {
            taskID=Request["taskID"];
            IntFactory.Sdk.TaskListResult result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTasks(taskID, userID, agentID);
            Dictionary<string, object> dr = new Dictionary<string, object>();
            if (true)
            {
                
            }
            return null;
        }
        public JsonResult GetTaskDetail(string taskID)
        {
            taskID = Request["taskID"];
            IntFactory.Sdk.TaskDetailResult result = IntFactory.Sdk.TaskBusiness.BaseBusiness.GetTaskDetail(taskID, userID, agentID);

            Dictionary<string, object> detailResult = new Dictionary<string, object>();

            if (string.IsNullOrEmpty(result.task.title)){
                detailResult.Add("title", "任务无标题");
            }
            else {
                detailResult.Add("title", result.task.title);
            }
            if (string.IsNullOrEmpty(result.task.finishStatus.ToString())){ 
            

            }
            

            return null;
           // return "a";
        }

    }
}
