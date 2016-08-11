using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace IntFactory.Sdk
{
    public class UserBusiness
    {
        /// <summary>
        /// 获取用户详情
        /// </summary>
        public static MemberResult GetMemberDetail(string token, string memberId)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("memberId", memberId);

            return HttpRequest.RequestServer<MemberResult>(ApiOption.MemberDetail, paras);
        }

        public static UserLoginResult UserLogin(string userName, string pwd,string userID,string clientID) 
        {
            var paras = new Dictionary<string, object>();
            paras.Add("userName", userName);
            paras.Add("pwd", pwd);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer<UserLoginResult>(ApiOption.UserLogin, paras);
        }

        public static UserLoginResult GetUserByWeiXinMP(string unionid, string openid, string userID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("unionid", unionid);
            paras.Add("openid", openid);
            paras.Add("userID", userID);

            return HttpRequest.RequestServer<UserLoginResult>(ApiOption.GetUserByWeiXinMP, paras);
        }

        public static UserLoginResult BindWeiXinMP(string unionid, string openid, string userID,string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("unionid", unionid);
            paras.Add("openid", openid);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer<UserLoginResult>(ApiOption.BindWeiXinMP, paras);
        }
    }
}
