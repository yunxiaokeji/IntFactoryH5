using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace IntFactoryH5Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string clientID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";

        public ActionResult Index(string ReturnUrl)
        {
            if (Session["ClientManager"] != null) {
                return Redirect("/Task/List");
            }

            ReturnUrl = ReturnUrl ?? string.Empty;
            ViewBag.ReturnUrl = ReturnUrl;

            return View();
        }

        public ActionResult Logout() {
            Session["ClientManager"] = null;
            
            return Redirect("/Home/Index");
        }

        public JsonResult UserLogin(string userName, string pwd)
        {
            Dictionary<string, object> resultObj = new Dictionary<string, object>();
            var result= IntFactory.Sdk.UserBusiness.UserLogin(userName, pwd,userID,clientID);

            if (result.error_code == 0) {
                Session["ClientManager"] = result.user;
            }

            return new JsonResult()
            {
                Data = result,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet
            };
        }
        public JsonResult SendPush()
        {
             Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();
             IntFactoryH5Web.Common.Push push = new Common.Push("A6925589056031", "97A4C2DD-D654-ACE3-CF21-5D8874D2ACF4");
             Dictionary<string, object> paras = new Dictionary<string, object>();
             paras.Add("title", "title");
             paras.Add("content", "content");
             paras.Add("type", 2);
             paras.Add("platform", 2);
             paras.Add("userIds", "865758026597275333");
             string paraStr = string.Empty;
             JavaScriptSerializer serializer = new JavaScriptSerializer();
             string result = push.Message(serializer.Serialize(paras));
             JsonDictionary.Add("result", result);

            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }
}
