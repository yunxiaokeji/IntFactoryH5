using IntFactory.Sdk;
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

        public ActionResult Code()
        {
            return View();
        }

        public ActionResult Login(string ReturnUrl, int BindAccountType=0)
        {
            if (BindAccountType == 0)
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
                        if (result.error_code == 0 && result.user != null)
                        {
                            Session["ClientManager"] = result.user;
                            return Redirect("/Task/List");
                        }
                    }
                }
            }
            ReturnUrl = ReturnUrl ?? string.Empty;
            ViewBag.ReturnUrl = ReturnUrl;
            ViewBag.BindAccountType = BindAccountType;

            return View();
        }

        public ActionResult Logout() 
        {
            Session["ClientManager"] = null;
            HttpCookie mycookie = Request.Cookies["m_intfactory_userinfo"];
            TimeSpan ts = new TimeSpan(0, 0, 0, 0); //时间跨度
            mycookie.Expires = DateTime.Now.Add(ts); //立即过期
            Response.Cookies.Remove("m_intfactory_userinfo");//清除
            Response.Cookies.Add(mycookie); //写入立即过期的*/
            Response.Cookies["m_intfactory_userinfo"].Expires = DateTime.Now.AddDays(-1);


            return Redirect("/Home/Login");
        }

        //跳转微信公众号授权
        public ActionResult WeiXinMPLogin(string returnUrl)
        {
            return Redirect(WeiXin.Sdk.Token.GetMPAuthorizeUrl(returnUrl));
        }

        //微信公众号授权回调地址
        public ActionResult WeiXinMPCallBack(string code,string state)
        {
            string url = "/home/login";
            if (!string.IsNullOrEmpty(code)) {
                var userToken = WeiXin.Sdk.Token.GetMPAccessToken(code);
                if (string.IsNullOrEmpty(userToken.errcode)) {
                    var result = IntFactory.Sdk.UserBusiness.GetUserByWeiXinMP(userToken.unionid, userToken.openid, userID);
                    if (result.result == 1)
                    {
                        Session["ClientManager"] = result.user;
                        return Redirect("/Task/List");
                    }
                    else  if (result.result == 0)
                    {
                        url += "?BindAccountType=4";
                        Session["WeiXinTokenInfo"] = userToken.access_token + "|" + userToken.openid + "|" + userToken.unionid;
                    }
                }
            }

            return Redirect(url);
        }

        //绑定微信公众号账户
        public int BindWeiXinMP(UserBase user)
        {
            int result = 0;
            if (Session["WeiXinTokenInfo"] != null)
            {
                string tokenInfo = Session["WeiXinTokenInfo"].ToString();
                string[] tokenArr = tokenInfo.Split('|');
                if (tokenArr.Length == 3)
                {
                    string access_token = tokenArr[0];
                    string openid = tokenArr[1];
                    string unionid = tokenArr[2];
                    var resultObj = IntFactory.Sdk.UserBusiness.BindWeiXinMP(unionid,openid, user.userID,user.clientID);
                    if (resultObj.result == 1)
                    {
                        Session.Remove("WeiXinTokenInfo");
                        result = 1;
                    }
                }
            }
            else
            {
                result = 5;
            }

            return result;
        }

        #region ajax
        public JsonResult UserLogin(string userName, string pwd, int bindAccountType=0)
        {
            Dictionary<string, object> resultObj = new Dictionary<string, object>();
            var result= IntFactory.Sdk.UserBusiness.UserLogin(userName, pwd,userID,clientID);
            if (result.result == 1) 
            {
                if (bindAccountType == 4) {
                    result.result=BindWeiXinMP(result.user);
                }
                if (result.result == 1) {
                    Session["ClientManager"] = result.user;
                    //保持登录状态
                    HttpCookie cook = new HttpCookie("m_intfactory_userinfo");
                    cook["username"] = userName;
                    cook["pwd"] = pwd;
                    cook.Expires = DateTime.Now.AddMonths(1);
                    Response.Cookies.Add(cook);
                }
            }

            return new JsonResult()
            {
                Data = result,
                JsonRequestBehavior=JsonRequestBehavior.AllowGet
            };
        }
        #endregion

    }
}
