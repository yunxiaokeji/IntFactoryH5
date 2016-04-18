using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IntFactoryH5Web.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string agentID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";

        public ActionResult Index(string ReturnUrl)
        {
            if (Session["ClientManager"] != null) {
                return Redirect("/Task/List");
            }

            ReturnUrl = ReturnUrl ?? string.Empty;
            ViewBag.ReturnUrl = ReturnUrl;

            return View();
        }


        public JsonResult UserLogin(string userName, string pwd)
        {
            Dictionary<string, object> resultObj = new Dictionary<string, object>();
            var result= IntFactory.Sdk.UserBusiness.UserLogin(userName, pwd,userID,agentID);

            if (result.error_code == 0) {
                Session["ClientManager"] = result.user;
            }

            return new JsonResult()
            {
                Data = result,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet
            };
        }

    }
}
