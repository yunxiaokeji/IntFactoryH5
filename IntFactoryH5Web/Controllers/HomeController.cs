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
        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string clientID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";
        public ActionResult Index()
        {
            return Redirect("/Home/Login");
        }

        public ActionResult Login(string ReturnUrl)
        {
            if (Session["ClientManager"] != null)
            {
                return Redirect("/Task/List");
            }
            else
            {
                HttpCookie userinfo = Request.Cookies["m_intfactory_userinfo"];
                if (userinfo != null)
                {
                    var result = IntFactory.Sdk.UserBusiness.UserLogin(userinfo["username"], userinfo["pwd"], userID, clientID);
                    if (result.error_code == 0 && result.user!=null)
                    {
                        Session["ClientManager"] = result.user;
                        return Redirect("/Task/List");
                    }
                }
            }
            ReturnUrl = ReturnUrl ?? string.Empty;
            ViewBag.ReturnUrl = ReturnUrl;

            return View();
        }

        public ActionResult Logout() 
        {
            Session["ClientManager"] = null;
            //Request.Cookies.Remove("m_intfactory_userinfo");
            //Request.Cookies.Clear();
            HttpCookie mycookie = Request.Cookies["m_intfactory_userinfo"];
            TimeSpan ts = new TimeSpan(0, 0, 0, 0); //时间跨度
            mycookie.Expires = DateTime.Now.Add(ts); //立即过期
            Response.Cookies.Remove("m_intfactory_userinfo");//清除
            Response.Cookies.Add(mycookie); //写入立即过期的*/
            Response.Cookies["m_intfactory_userinfo"].Expires = DateTime.Now.AddDays(-1);


            return Redirect("/Home/Login");
        }

        #region ajax
        public JsonResult UserLogin(string userName, string pwd)
        {
            Dictionary<string, object> resultObj = new Dictionary<string, object>();
            var result= IntFactory.Sdk.UserBusiness.UserLogin(userName, pwd,userID,clientID);
            if (result.error_code == 0) 
            {
                Session["ClientManager"] = result.user;
                //保持登录状态
                HttpCookie cook = new HttpCookie("m_intfactory_userinfo");
                cook["username"] = userName;
                cook["pwd"] = pwd;
                cook.Expires = DateTime.Now.AddMonths(1);
                Response.Cookies.Add(cook);
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
             paras.Add("userIds", "63227a7c-955a-4b65-9477-66df0d078dc0,5ef4141c-ac6d-4acf-af8e-abd9db6aaf53");
             JavaScriptSerializer serializer = new JavaScriptSerializer();
             string result = push.Message(serializer.Serialize(paras));
             JsonDictionary.Add("result", result);

            return new JsonResult
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        #endregion

    }
}
