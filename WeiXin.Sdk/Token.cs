﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace WeiXin.Sdk
{
    public class Token
    {
        public static string GetMPAuthorizeUrl(string returnUrl)
        {
            string apiUrl = "https://open.weixin.qq.com";
            apiUrl += "/connect/oauth2/authorize";

            string url= string.Format("{0}?appid={1}&redirect_uri={2}&response_type={3}&scope={4}",
               apiUrl, AppConfig.WeiXinMPAppKey, AppConfig.WeiXinMPCallBackUrl, "code", "snsapi_userinfo");

            if (!string.IsNullOrEmpty(returnUrl)) {
                url += "&state="+returnUrl;
            }
            return url;
        }

        public static TokenEntity GetMPAccessToken(string code)
        {
            Dictionary<string, object> paras = new Dictionary<string, object>();
            paras.Add("appid",AppConfig.WeiXinMPAppKey);
            paras.Add("secret", AppConfig.WeiXinMPAppSecret);
            paras.Add("code", code);
            paras.Add("grant_type", "authorization_code");

            var result = HttpRequest.RequestServer(ApiOption.access_token, paras, RequestType.Post);
            return JsonConvert.DeserializeObject<TokenEntity>(result);
        }

    }
}
